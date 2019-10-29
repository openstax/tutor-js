import { action, computed, observable, runInAction } from 'mobx';
import moment from 'moment';
import { difference, map, get, compact, isEmpty, filter, first } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import Exercises from '../../models/exercises';
import TaskPlan, { SELECTION_COUNTS, calculateDefaultOpensAt } from '../../models/task-plans/teacher/plan';
import ReferenceBook from '../../models/reference-book';
import Form from './form';


class AssignmentBuilderUX {

  @observable isShowingSectionSelection = false;
  @observable isShowingExercises = false;
  @observable isShowingExerciseReview = false;
  @observable isShowingPeriodTaskings;
  @observable exercises;
  @observable isReady = false;
  @observable sourcePlanId;

  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, type, plan, course, onComplete, due_at,
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
      const opens_at = calculateDefaultOpensAt({ course: this.course });
      this.periods.map((period) =>
        this.plan.findOrCreateTaskingForPeriod(period, { opens_at }),
      );
      if (due_at) {
        this.plan.tasking_plans.forEach(tp => tp.initializeWithDueAt(due_at));
      }
    } else {
      await this.plan.ensureLoaded();
    }

    this.onComplete = onComplete;
    this.exercises = exercises;
    if (this.plan.isReading) {
      await this.referenceBook.ensureLoaded();
    }
    this.windowImpl = windowImpl;

    this.isShowingPeriodTaskings = !this.plan.areTaskingDatesSame;
    this.scroller = new ScrollTo({ windowImpl });
    this.form = new Form(this);
    this.isReady = true;
  }

  @computed get isInitializing() {
    return !this.isReady || !this.plan || this.plan.api.isPendingInitialFetch;
  }

  @computed get canSelectAllSections() {
    return Boolean(
      this.plan.isEditable && isEmpty(difference(
        map(this.course.periods.active, 'id'),
        map(this.plan.tasking_plans, 'target_id'),
      ))
    );
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

  @computed get periods() {
    return filter(this.course.periods.sorted, 'isActive');
  }

  @action.bound async onExercisesShow() {
    this.scroller.scrollToSelector('.select-sections .panel-footer'); // move down so loader shows

    this.isShowingExercises = true;

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

  @action.bound onShowSectionSelection() {
    this.isShowingSectionSelection = true;
  }

  @action copyFrom({ plan }) {
    this.plan.update(plan.clonedAttributes);
    this.plan.cloned_from_id = plan.id;
  }

  @action async onExercisesReview() {
    await this.exercises.ensureExercisesLoaded({
      course: this.course,
      book: this.referenceBook,
      exercise_ids: this.plan.settings.exercise_ids,
    });
  }

  @computed get selectedExercises() {
    if (isEmpty(this.exercises)) { return [];  }
    return compact(map(this.plan.settings.exercise_ids, exId => (
      this.exercises.get(exId)
    )));
  }

  @computed get numTutorSelections() {
    return get(this.plan, 'settings.exercises_count_dynamic', 0);
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

  @action onExercisesReviewMount(el) {
    this.scroller.scrollToElement(el);
  }

  @action async onSelectSectionsMount(el) {
    if (this.referenceBook.api.isPendingInitialFetch) {
      this.scroller.scrollToElement(el);
      await this.referenceBook.ensureLoaded();
    }
    this.scroller.scrollToElement(el);
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


  @action.bound onSectionIdsChange(ids) {
    this.plan.settings.page_ids = ids;
  }

  @action.bound onExerciseToggle(event, exercise) {
    const ex = exercise.wrapper;
    ex.isSelected = !ex.isSelected;
    ex.isSelected ? this.plan.addExercise(ex) : this.plan.removeExercise(ex);
  }

  @computed get canEdit() {
    return this.plan.canEdit;
  }

  @action.bound onSelectSectionConfirm() {
    this.isShowingSectionSelection = false;
  }

  @action.bound onExercisesReviewClicked() {
    this.isShowingSectionSelection = false;
    this.isShowingExercises = false;
    this.isShowingExerciseReview = true;
  }

  @action.bound onSectExercisesCancel() {
    this.isShowingSectionSelection = false;
    this.isShowingExercises = false;
    this.isShowingExerciseReview = false;
    this.scroller.scrollToTop();
  }

  @action.bound onExercisesHide() {
  }

  @action.bound onExercisesAddClick() {
    this.showProblems = false;
    this.scroller.scrollToSelector('.select-sections');
  }

  @action.bound onCancel() {
    this.onComplete();
  }

  @action async saveAndCopyPlan() {
    const success = await this.form.onSaveRequested();
    if (! success) {
      return;
    }
    runInAction(() => {
      const destPlan = this.course.teacherTaskPlans.withPlanId(this.plan.id);
      destPlan.update(this.plan.serialize());
      this.onComplete();
    });
  }

  @action.bound async onDelete() {
    await this.plan.destroy();
    this.onComplete();
  }

  @action.bound onPublish() {
    if (!this.plan.is_published) {
      this.plan.is_publish_requested = true;
    }
    this.saveAndCopyPlan();
  }

  @action.bound onSaveAsDraft() {
    this.plan.is_draft = true;
    this.saveAndCopyPlan();
  }

  @computed get isPublishing() {
    return this.plan.api.isPending && this.plan.is_publish_requested;
  }

  @computed get isSaving() {
    return this.plan.api.isPending;
  }

  @action.bound onShowSectionTopics() {

  }
  @action.bound setExternalUrl(url) {
    this.plan.settings.external_url = url;
  }

  @computed get term() {
    return {
      start: moment(this.course.starts_at),
      end: moment(this.course.starts_at),
    };
  }

  @action.bound togglePeriodTaskingsEnabled(ev) {
    this.isShowingPeriodTaskings = ev.target.value == 'periods';
    if (this.isShowingPeriodTaskings) {
      return;
    }
    const firstTasking = first(this.plan.tasking_plans);
    this.plan.tasking_plans = [];

    const opens_at = (firstTasking && firstTasking.opens_at) ||
          calculateDefaultOpensAt({ course: this.course });
    const due_at = (firstTasking && firstTasking.due_at);
    this.periods.map((period) =>
      this.plan.findOrCreateTaskingForPeriod(period, { opens_at, due_at }),
    );
  }

  @action.bound togglePeriodTasking({ target: input }) {
    const period = this.plan.course.periods.find(p => p.id == input.dataset.periodId);
    if (!period) { return; }

    const tasking = this.plan.tasking_plans.forPeriod(period);

    if (input.checked && !tasking) {
      const firstTp = first(this.plan.tasking_plans);
      const opens_at = (firstTp && firstTp.opens_at) || calculateDefaultOpensAt({ course: this.course });
      const due_at = firstTp && firstTp.due_at;
      this.plan.findOrCreateTaskingForPeriod(period, { opens_at, due_at });
    } else if (!input.checked && tasking) {
      this.plan.tasking_plans.remove(tasking);
    }
  }

  @computed get maxDueAt() {
    return {
      date: this.term.end.format('YYYY-MM-DD'),
      time: this.course.default_due_time,
    };
  }
}

export default AssignmentBuilderUX;
