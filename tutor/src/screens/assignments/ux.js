import { React, observable, computed, action } from 'vendor';
import ScrollTo from '../../helpers/scroll-to';
import { filter, isEmpty, compact, map, get } from 'lodash';
import Exercises from '../../models/exercises';
import TaskPlan, { SELECTION_COUNTS } from '../../models/task-plans/teacher/plan';
import ReferenceBook from '../../models/reference-book';
import { Step, STEP_IDS } from './step';
import Validations from './validations';

export default class AssignmentUX {

  @observable _stepIndex = 0;
  @observable isShowingSectionSelection = false;
  @observable isShowingExerciseReview = false;
  @observable isShowingPeriodTaskings;
  @observable exercises;
  @observable isReady = false;
  @observable sourcePlanId;
  @observable form;

  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, type, plan, course, onComplete,
    gradingTemplates = course.gradingTemplates,
    exercises = Exercises,
    windowImpl = window,
  }) {
    if ('clone' === type) {
      if (!course.pastTaskPlans.api.hasBeenFetched) {
        await course.pastTaskPlans.fetch();
      }
      this.sourcePlanId = id;
      this.plan = course.pastTaskPlans.get(id).createClone({ course });
    } else {
      if (plan) {
        this.plan = plan;
      } else {
        this.plan = new TaskPlan({ id, course, type });
        if (id && id != 'new') {
          const existing = course.teacherTaskPlans.get(id);
          if (existing) {
            this.plan.update( existing.serialize() );
          }
        }
      }
      if (type) {
        this.plan.type = type;
      }
    }

    this.course = course;

    if (this.plan.isNew) {
      // const opens_at = calculateDefaultOpensAt({ course: this.course });
      // this.periods.map((period) =>
      //   this.plan.findOrCreateTaskingForPeriod(period, { opens_at }),
      // );
      // if (due_at) {
      //   this.plan.tasking_plans.forEach(tp => tp.initializeWithDueAt(due_at));
      // }
    } else {
      await this.plan.ensureLoaded();
    }

    // once templates is loaded, select ones of the correct type
    await gradingTemplates.ensureLoaded();
    this.gradingTemplates = filter(gradingTemplates.array, t => t.task_plan_type == type);

    this.onComplete = onComplete;
    this.exercises = exercises;
    if (this.plan.isReading) {
      await this.referenceBook.ensureLoaded();
    }
    this.windowImpl = windowImpl;

    this.isShowingPeriodTaskings = !(this.canSelectAllSections && this.plan.areTaskingDatesSame);

    this.scroller = new ScrollTo({ windowImpl });
    this.validations = new Validations(this);
    this.isReady = true;
  }

  @computed get isInitializing() {
    return !this.isReady || !this.plan || this.plan.api.isPendingInitialFetch;
  }

  get referenceBook() {
    if (this._referenceBook) {
      return this._referenceBook;
    }
    if (this.plan.ecosystem_id && this.plan.ecosystem_id != this.course.ecosystem_id) {
      this._referenceBook = new ReferenceBook({ id: this.plan.ecosystem_id });
    } else {
      this._referenceBook = this.course.referenceBook;
    }
    return this._referenceBook;
  }

  @action.bound renderStep(form) {
    this.form = form;
    return <Step ux={this} />;
  }

  get formValues() {
    return this.plan; // .serialize();
  }

  @computed get isApiPending() {
    return this.plan.api.isPending;
  }

  @computed get stepNumber() {
    return this._stepIndex + 1;
  }

  @action.bound goToStep(index) {
    this._stepIndex = index;
  }

  @action.bound goForward() {
    if (this.canGoForward) {
      // TODO, skip steps if the assignment type doesn't need the next,
      // for instance events won't have chapters & questiosn
      this.goToStep(this._stepIndex + 1);
    }

    if (this.isShowingExercises) {
      this.onExercisesShow();
    }
  }

  @action.bound goBackward() {
    if (this.canGoBackward) {
      this.goToStep(this._stepIndex - 1);
    }
  }

  @computed get canGoForward() {
    return Boolean(
      !this.isApiPending &&
        this._stepIndex < STEP_IDS.length - 1 &&
        this.validations.isValid
    );
  }

  @computed get currentStepId() {
    return STEP_IDS[this._stepIndex];
  }

  @computed get canGoBackward() {
    return Boolean(
      !this.isApiPending && this._stepIndex > 0
    );
  }

  @computed get canEdit() {
    return this.plan.canEdit;
  }

  @computed get selectedPageIds() {
    return this.plan.pageIds;
  }

  @computed get selectedChapterSections() {
    return filter(map(this.selectedPages, 'chapter_section'), 'isPresent');
  }

  @computed get selectedPages() {
    return this.selectedPageIds.map(pgId => this.referenceBook.pages.byId.get(pgId));
  }

  @action.bound onSectionIdsChange(ids) {
    this.plan.settings.page_ids = ids;
  }

  @action.bound onExerciseToggle(event, exercise) {
    const ex = exercise.wrapper;
    ex.isSelected = !ex.isSelected;
    ex.isSelected ? this.plan.addExercise(ex) : this.plan.removeExercise(ex);
  }

  @computed get isFetchingExercises() {
    return this.exercises.isFetching({ pageIds: this.selectedPageIds });
  }

  @computed get isShowingExercises() {
    return this._stepIndex === 2;
  }

  @action.bound async onExercisesShow() {
    await this.exercises.fetch({
      course: this.course,
      book: this.referenceBook,
      page_ids: this.selectedPageIds,
    });

    this.selectedPageIds.forEach(pgId => {
      this.exercises.forPageId(pgId).forEach(
        e => e.isSelected = this.plan.includesExercise(e)
      );
    });
  }

  @action async onExercisesReview() {
    await this.exercises.ensureExercisesLoaded({
      course: this.course,
      book: this.referenceBook,
      exercise_ids: this.plan.settings.exercise_ids,
    });
  }

  @computed get selectedExercises() {
    if (isEmpty(this.exercises)) { return []; }
    return compact(map(this.plan.settings.exercise_ids, exId => (
      this.exercises.get(exId)
    )));
  }

  @computed get numTutorSelections() {
    return get(this.plan, 'settings.exercises_count_dynamic', 0);
  }

  @action.bound increaseTutorSelection() {
    if (this.canIncreaseTutorExercises) {
      this.plan.settings.exercises_count_dynamic = this.numTutorSelections + 1;
    }
  }

  @action.bound decreaseTutorSelection() {
    if (this.canDecreaseTutorExercises) {
      this.plan.settings.exercises_count_dynamic = this.numTutorSelections - 1;
    }
  }

  @computed get canIncreaseTutorExercises() {
    return this.canEdit && this.numTutorSelections < SELECTION_COUNTS.max;
  }

  @computed get canDecreaseTutorExercises() {
    return this.canEdit && this.numTutorSelections > SELECTION_COUNTS.min;
  }

  @computed get numExerciseSteps() {
    return Math.max(
      this.selectedExercises.reduce(
        (count, ex) => count + get(ex, 'content.questions.length', 0), 0,
      ),
      get(this.plan.settings, 'exercise_ids.length', 0),
    );
  }

  isExerciseSelected(ex) {
    return this.selectedExercises.includes(ex);
  }

  @computed get displayedExercises() {
    return this.exercises.where(ex => (
      this.isExerciseSelected(ex) || (
        ex.isHomework && ex.isAssignable &&
          ex.page && this.selectedPageIds.includes(ex.page.id)
      )
    ));
  }

}
