import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { map, compact, isEmpty } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import Exercises from '../../models/exercises';
import Router from '../../helpers/router';
import TaskPlanHelper from '../../helpers/task-plan';
import TaskPlan from '../../models/task-plans/teacher/plan';
import ReferenceBook from '../../models/reference-book';
import Form from './form';

class AssignmentBuilderUX {

  @observable isShowingSectionSelection = false;
  @observable isShowingExercises = false;
  @observable isShowingExerciseReview = false;
  @observable isShowingPeriodTaskings;
  @observable exercises;

  constructor({
    id, type, plan, course, history,
    exercises = Exercises,
    windowImpl = window,
  }) {

    if (plan) {
      this.plan = plan;
    } else {
      this.plan = new TaskPlan({ course, type });
      if (id != 'new') {
        this.plan.update( course.teacherTaskPlans.withPlanId(id).serialize() );
      }
    }
    if (type) {
      this.plan.type = type;
    }
    this.history = history;
    this.course = course;
    this.exercises = exercises;
    this.windowImpl = windowImpl;
    this.isShowingPeriodTaskings = !this.plan.areTaskingDatesSame;
    this.scroller = new ScrollTo({ windowImpl });

    this.form = new Form(this);
  }

  @computed get selectedPageIds() {
    return this.plan.pageIds;
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

  @action onSelectSectionsMount(el) {
    // scroll again, maybe above scroll isn't needed?

    this.scroller.scrollToElement(el);
  }

  @computed get referenceBook() {
    if (this.plan.ecosystem_id && this.plan.ecosystem_id != this.course.ecosystem_id) {
      return new ReferenceBook({ id: this.plan.ecosystem_id });
    }
    return this.course.referenceBook;
  }

  // @computed get sections() {
  //   return this.referenceBook.sectionsForPageIds(this.selectedPageIds);
  // }

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

  @computed get canEdit() {
    return this.plan.canEdit;
  }

  @computed get canSave() {
    return this.form.canSave;
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
    const route = TaskPlanHelper.calendarParams(this.course);
    this.history.push(Router.makePathname(route.to, route.params));
  }

  @action async saveAndCopyPlan() {
    await this.form.onSaveRequested();
    const destPlan = this.course.teacherTaskPlans.withPlanId(this.plan.id);
    destPlan.update(this.plan.serialize());
    this.onCancel();
  }

  @action.bound async onDelete() {

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

  @computed get hasError() {
    return (this.form.submitted || this.form.touched) && this.form.hasError;
  }

  @computed get isWaiting() {
    return false;
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
    this.plan.tasking_plans = [];
    this.course.periods.active.map((period) =>
      this.plan.findOrCreateTaskingForPeriod(period),
    );
  }

  @computed get maxDueAt() {
    return {
      date: this.term.end.format('YYYY-MM-DD'),
      time: this.course.default_due_time,
    };
  }
}

export default AssignmentBuilderUX;
