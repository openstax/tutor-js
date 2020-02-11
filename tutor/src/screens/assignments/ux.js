import { React, observable, computed, action } from 'vendor';
import Router from '../../helpers/router';
import { runInAction } from 'mobx';
import ScrollTo from '../../helpers/scroll-to';
import { filter, isEmpty, compact, map, get, first, difference } from 'lodash';
import Exercises from '../../models/exercises';
import TaskPlan, { SELECTION_COUNTS } from '../../models/task-plans/teacher/plan';
import ReferenceBook from '../../models/reference-book';
import { StepUX, Step } from './step';
import { Actions } from './actions';
import Validations from './validations';

export default class AssignmentUX {

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
    id, type, plan, course, history,
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
    // don't setup steps until course and plan is set
    this.steps = new StepUX(this);
    this.actions = new Actions(this);

    if (this.plan.isNew) {
      this.periods.map((period) =>
        this.plan.findOrCreateTaskingForPeriod(period),
      );
      // if (due_at) {
      //   this.plan.tasking_plans.forEach(tp => tp.initializeWithDueAt(due_at));
      // }
    } else {
      await this.plan.ensureLoaded();
    }

    // once templates is loaded, select ones of the correct type
    await gradingTemplates.ensureLoaded();
    this.gradingTemplates = filter(gradingTemplates.array, t => t.task_plan_type == type);
    if (!this.plan.grading_template_id) {
      this.plan.grading_template_id = this.plan.grading_template_id || get(this.gradingTemplates, '[0].id');
    }

    this.history = history;
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

  @computed get canSelectAllSections() {
    return Boolean(
      this.plan.isEditable && isEmpty(difference(
        map(this.course.periods.active, 'id'),
        map(this.plan.tasking_plans, 'target_id'),
      ))
    );
  }

  @computed get periods() {
    return filter(this.course.periods.sorted, 'isActive');
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

  @action.bound navigateToStep(index) {
    this.history.push(
      Router.makePathname('editAssignment', {
        courseId: this.course.id,
        type: this.plan.type,
        id: this.plan.id || 'new',
        step: index,
      })
    );
  }

  @action.bound onComplete() {
    this.history.push(`/course/${this.course.id}`);
  }

  @action.bound onCancel() {
    this.onComplete();
  }

  get formValues() {
    return this.plan;
  }

  @computed get isApiPending() {
    return this.plan.api.isPending;
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

  @action.bound togglePeriodTasking({ target: input }) {
    const period = this.plan.course.periods.find(p => p.id == input.dataset.periodId);
    if (!period) { return; }

    const tasking = this.plan.tasking_plans.forPeriod(period);

    if (input.checked && !tasking) {
      const firstTp = first(this.plan.tasking_plans);
      const opens_at = firstTp && firstTp.opens_at;
      const due_at = firstTp && firstTp.due_at;
      this.plan.findOrCreateTaskingForPeriod(period, { opens_at, due_at });
    } else if (!input.checked && tasking) {
      this.plan.tasking_plans.remove(tasking);
    }
  }

  @action.bound togglePeriodTaskingsEnabled(ev) {
    this.isShowingPeriodTaskings = ev.target.value == 'periods';
    if (this.isShowingPeriodTaskings) {
      return;
    }
    this.periods.map((period) =>
      this.plan.findOrCreateTaskingForPeriod(period)
    );
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

  @computed get gradingTemplate() {
    return (
      this.course.gradingTemplates.array.find(t => t.id == this.form.values.grading_template_id)
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

  @action.bound async onSaveAsDraftClick() {
    await this.saveAsDraft();
    this.onComplete();
  }

  @action.bound async onPublishClick() {
    this.plan.is_draft = false;
    if (!this.plan.is_published) {
      this.plan.is_publish_requested = true;
    }
    await this.saveAndCopyPlan();
    this.onComplete();
  }

  @action.bound async saveAsDraft() {
    this.plan.update(this.form.values.serialize());
    this.plan.is_draft = true;
    await this.saveAndCopyPlan();
  }

  @action async saveAndCopyPlan() {
    await this.plan.save();
    await runInAction(() => {
      const destPlan = this.course.teacherTaskPlans.withPlanId(this.plan.id);
      destPlan.update(this.plan.serialize());
    });
  }

}
