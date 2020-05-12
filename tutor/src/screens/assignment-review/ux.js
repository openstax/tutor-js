import { React, observable, action, computed } from 'vendor';
import { first, pick, sortBy, filter } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import TaskPlanScores from '../../models/task-plans/teacher/scores';
import DropQuestion from '../../models/task-plans/teacher/dropped_question';
import Exercises from '../../models/exercises';
import EditUX from '../assignment-edit/ux';
import DetailsBody from '../assignment-edit/details-body';
import rowDataSorter from './scores-data-sorter';

export default class AssignmentReviewUX {

  @observable selectedPeriod;
  @observable exercisesHaveBeenFetched = false;
  @observable isDisplayingGrantExtension = false;
  @observable isDisplayingDropQuestions = false;
  @observable isDisplayingConfirmDelete = false;
  @observable isDisplayingEditAssignment = false;
  @observable isDeleting = false;
  @observable editUX;
  @observable rowSort = { key: 0, asc: true, dataType: 'name' };
  @observable searchingMatcher = null;

  freeResponseQuestions = observable.map();
  pendingExtensions = observable.map();
  pendingDroppedQuestions = observable.map();

  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, scores, course, onCompleteDelete, history,
    windowImpl = window,
  }) {
    this.scroller = new ScrollTo({ windowImpl });
    this.planScores = scores || new TaskPlanScores({ id, course });
    this.course = course;
    this.selectedPeriod = first(course.periods.active);
    this.onCompleteDelete = onCompleteDelete;

    await this.planScores.fetch();
    await this.planScores.taskPlan.analytics.fetch();

    this.editUX = new EditUX();
    this.editUX.initialize({
      ...this.params,
      plan: this.planScores.taskPlan,
      history,
      course,
    });

    await Exercises.ensureExercisesLoaded({ course: this.course, exercise_ids: this.planScores.exerciseIds });
    this.exercisesHaveBeenFetched = true;
  }

  @computed get isScoresReady() { return this.planScores.api.hasBeenFetched; }
  @computed get isExercisesReady() { return this.isScoresReady && this.exercisesHaveBeenFetched; }
  @computed get planId() { return this.planScores.id; }

  @action.bound setSelectedPeriod(period) {
    this.selectedPeriod = period;
  }

  @computed get scores() {
    return this.planScores.tasking_plans.find(tp => this.selectedPeriod.id == tp.period_id);
  }

  @computed get taskingPlan() {
    return this.planScores.taskPlan.tasking_plans.forPeriod(this.selectedPeriod);
  }

  @computed get sortedStudents() {
    const students = rowDataSorter(this.scores.students, this.rowSort);
    if (!this.searchingMatcher) {
      return students;
    }
    return filter(students, s => s.name.match(this.searchingMatcher));

  }

  @action.bound changeRowSortingOrder(key, dataType) {
    this.rowSort.asc = this.rowSort.key === key ? (!this.rowSort.asc) : false;
    this.rowSort.key = key;
    this.rowSort.dataType = dataType;
  }
  
  isRowSortedBy({ sortKey, dataType }) {
    return (this.rowSort.key === sortKey) && (this.rowSort.dataType === dataType);
  }

  sortForColumn(sortKey, dataType) {
    return (this.rowSort.key === sortKey) && (this.rowSort.dataType === dataType) ? this.rowSort : false;
  }


  isShowingFreeResponseForQuestion(question) {
    return Boolean(this.freeResponseQuestions.get(question.id));
  }

  @action.bound toggleFreeResponseForQuestion(question) {
    this.freeResponseQuestions.set(question.id, !this.isShowingFreeResponseForQuestion(question));
  }

  @action.bound onSearchStudentChange({ target: { value } }) {
    this.searchingMatcher = value ? RegExp(value, 'i') : null;
  }

  // methods relating to granting extensions

  @action.bound cancelDisplayingGrantExtension() {
    this.pendingExtensions.clear();
    this.isDisplayingGrantExtension = false;
  }

  @action.bound saveDisplayingGrantExtension() {
    // TODO: actually save
    this.cancelDisplayingGrantExtension();
  }


  // methods relating to droppping questions

  @action toggleDropQuestion(isDropped, { question_id }) {
    if (isDropped) {
      this.pendingDroppedQuestions.set(question_id, new DropQuestion({ question_id }));
    } else {
      this.pendingDroppedQuestions.delete(question_id);
    }
  }

  @action.bound cancelDisplayingDropQuestions() {
    this.pendingDroppedQuestions.clear();
    this.isDisplayingDropQuestions = false;
  }

  @action.bound async saveDropQuestions() {
    const { taskPlan } = this.planScores;
    this.pendingDroppedQuestions.forEach(dq => {
      taskPlan.dropped_questions.push(dq);
      this.planScores.dropped_questions.push(dq);
    });
    await taskPlan.saveDroppedQuestions();
    this.cancelDisplayingDropQuestions();
  }

  droppedQuestionRecord(heading) {
    return heading.dropped || this.pendingDroppedQuestions.get(heading.question_id);
  }

  @action.bound onDelete() {
    this.isDisplayingConfirmDelete = true;
  }

  @action.bound async onConfirmDelete() {
    const { taskPlan } = this.planScores;
    const date = taskPlan.dateRanges.opens.start.format('YYYY-MM-DD');
    this.isDeleting = true;
    await taskPlan.destroy();
    this.onCompleteDelete(date);
  }

  @action.bound onCancelDelete() {
    this.isDisplayingConfirmDelete = false;
  }

  @action.bound onEdit() {
    this.isDisplayingEditAssignment = true;
  }

  @action.bound onCancelEdit() {
    this.isDisplayingEditAssignment = false;
  }

  @action.bound async onSavePlan() {
    await this.editUX.savePlan();
    Object.assign(this.planScores, pick(this.editUX.plan, ['title', 'description']));
    this.planScores.grading_template = this.editUX.plan.gradingTemplate;
    this.isDisplayingEditAssignment = false;
  }

  @action.bound renderDetails(form) {
    this.editUX.form = form;
    return <DetailsBody ux={this.editUX} />;
  }

  @computed get submitPending() {
    return Boolean(
      this.editUX.plan.api.isPending
    );
  }

  @computed get canSubmit() {
    return Boolean(
      this.editUX.validations.isValid
    );
  }

  @computed get areTaskingDatesSame() {
    return Boolean(
      this.planScores.taskPlan.areTaskingDatesSame
    );
  }

  @computed get taskingPlanDetails() {
    return this.areTaskingDatesSame ?
      [first(this.planScores.taskPlan.tasking_plans)] :
      sortBy(this.planScores.taskPlan.tasking_plans, tp => tp.period.name);
  }

  @computed get stats() {
    return this.planScores.taskPlan.analytics.stats;
  }

  @computed get progressStatsForPeriod() {
    // period stats will be undefined if no-ones worked the assignment in the period yet
    const periodStats = this.stats.find(s => s.period_id == this.selectedPeriod.id);
    const { total_count = 0, complete_count = 0, partially_complete_count = 0 } = periodStats || { };
    const notStartedCount = total_count - (complete_count + partially_complete_count);

    const items = [
      { label: 'Completed',
        value: complete_count,
        percent: (complete_count / total_count),
      },
      { label: 'In progress',
        value: partially_complete_count,
        percent: (partially_complete_count / total_count),
      },
      { label: 'Not started',
        value: notStartedCount,
        percent: (notStartedCount / total_count),
      },
    ];

    return items;
  }

  @computed get canDisplayGradingBlock() {
    return Boolean(this.planScores.isHomework);
  }

  @computed get canDisplayAssignmentSettings() {
    return Boolean(['reading', 'homework'].includes(this.planScores.type));
  }

}
