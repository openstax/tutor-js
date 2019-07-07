import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { map, compact, isEmpty, get } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import Exercises from '../../models/exercises';
import ReferenceBook from '../../models/reference-book';
import Form from './form';

class AssignmentBuilderUX {

  @observable isShowingSectionSelection = false;
  @observable isShowingExercises = false;
  @observable isShowingExerciseReview = false;
  @observable isShowingPeriodTaskings;
  @observable exercises;

  constructor({ plan, course, exercises = Exercises, windowImpl = window }) {
    this.course = course;
    this.exercises = exercises;
    this.windowImpl = windowImpl;
    this.isShowingPeriodTaskings = !plan.areTaskingDatesSame;
    this.scroller = new ScrollTo({ windowImpl });
    this.plan = plan;
    this.form = new Form(this);
  }

  @computed get selectedPageIds() {
    return get(this.plan, 'settings.page_ids', []);
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

  @computed get sections() {
    return this.referenceBook.sectionsForPageIds(this.selectedPageIds);
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

  @action.bound onSelectSectionsCancel() {

  }

  @action.bound onSelectSectionsHide() {

  }

  @action.bound onSelectSectionConfirm() {
    this.isShowingSectionSelection = false;
  }

  @action.bound onExercisesReviewClicked() {
    this.isShowingSectionSelection = false;
    this.isShowingExercises = false;
    this.isShowingExerciseReview = true;
  }

  @action.bound onExercisesCancel() {
  }

  @action.bound onExercisesHide() {
  }

  @action.bound onExercisesAddClick() {
    this.showProblems = false;
    this.scroller.scrollToSelector('.select-sections');
  }

  @action.bound onCancel() {

  }

  @action.bound async onDelete() {

  }

  @action.bound async onPublish(e) {
    if (!this.plan.is_published) {
      this.plan.is_publish_requested = true;
    }
    await this.form.onSaveRequested(e);
    this.onCancel();
  }

  @action.bound async onSaveAsDraft(e) {
    this.plan.is_draft = true;
    await this.form.onSaveRequested(e);
    this.onCancel();
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
