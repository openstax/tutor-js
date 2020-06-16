import { React, observable, action, computed } from 'vendor';
import { first, pick, sortBy, filter, sumBy, get, find } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import DropQuestion from '../../models/task-plans/teacher/dropped_question';
import EditUX from '../assignment-edit/ux';
import DetailsBody from '../assignment-edit/details-body';
import rowDataSorter from './scores-data-sorter';
import scrollIntoView from 'scroll-into-view';

export default class AssignmentReviewUX {

  @observable selectedPeriod;
  @observable exercisesHaveBeenFetched = false;
  @observable isDisplayingGrantExtension = false;
  @observable isDisplayingDropQuestions = false;
  @observable isDisplayingConfirmDelete = false;
  @observable isDisplayingEditAssignment = false;
  @observable isDeleting = false;
  @observable editUX;
  @observable editablePlan;
  @observable rowSort = { key: 0, asc: true, dataType: 'name' };
  @observable searchingMatcher = null;
  @observable reverseNameOrder = false;
  @observable displayTotalInPercent = false;

  freeResponseQuestions = observable.map();
  pendingExtensions = observable.map();
  pendingDroppedQuestions = observable.map();

  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, course, onCompleteDelete, onEditAssignedQuestions, onTabSelection, history, periodId,
    scores = course.teacherTaskPlans.withPlanId(id).scores,
    windowImpl = window,
  }) {
    this.id = id;
    this.history = history;
    this.scroller = new ScrollTo({ windowImpl });
    this.planScores = scores;
    this.course = course;
    this.onCompleteDelete = onCompleteDelete;
    this.onEditAssignedQuestions = onEditAssignedQuestions;
    this.onTabSelection = onTabSelection;

    await this.planScores.fetch();
    await this.planScores.taskPlan.fetch();
    await this.planScores.taskPlan.analytics.fetch();
    await this.planScores.ensureExercisesLoaded();

    const period = find(this.assignedPeriods, p => p.id == periodId);
    this.selectedPeriod = period ? period : first(this.assignedPeriods);
    this.exercisesHaveBeenFetched = true;
    this.freeResponseQuestions.set(get(this.scores, 'questionsInfo[0].id'), true);
  }

  @computed get isScoresReady() { return this.planScores.api.hasBeenFetched; }
  @computed get isExercisesReady() { return this.isScoresReady && this.exercisesHaveBeenFetched; }
  @computed get planId() { return this.planScores.id; }

  @action.bound setSelectedPeriod(period) {
    this.selectedPeriod = period;
  }

  @computed get scores() {
    if (!this.selectedPeriod) { return null; }
    return this.planScores.tasking_plans.find(tp => this.selectedPeriod.id == tp.period_id);
  }

  @computed get taskingPlan() {
    return this.planScores.taskPlan.tasking_plans.forPeriod(this.selectedPeriod);
  }

  @computed get taskPlan() {
    return this.planScores.taskPlan;
  }

  @computed get assignedPeriods() {
    return this.planScores.taskPlan.activeAssignedPeriods;
  }

  // methods relating to sorting and filtering scores table

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

  @action.bound toggleNameOrder() {
    this.reverseNameOrder = !this.reverseNameOrder;
  }

  @computed get nameOrderHeader() {
    return this.reverseNameOrder ? 'Firstname Lastname' : 'Lastname, Firstname';
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

  @computed get isPendingExtensions() {
    return this.pendingExtensions.size > 0;
  }

  @action.bound toggleGrantExtensionAllStudents({ target: { checked } }) {
    this.scores.students.forEach(s => {
      this.pendingExtensions.set(s.role_id, checked);
    });
  }

  @action.bound cancelDisplayingGrantExtension() {
    this.pendingExtensions.clear();
    this.isDisplayingGrantExtension = false;
  }

  @action.bound async saveDisplayingGrantExtension(values) {
    const due_at = this.course.momentInZone(values.extension_due_date);
    const closes_at = this.course.momentInZone(values.extension_close_date);
    const extensions = [];
    this.pendingExtensions.forEach((extend, role_id) => {
      if (extend) {
        extensions.push({ role_id, due_at, closes_at });
      }
    });
    if (extensions.length > 0) {
      await this.taskPlan.grantExtensions(extensions);
    }
    this.cancelDisplayingGrantExtension();
  }

  wasGrantedExtension(role_id) {
    return Boolean(
      this.taskPlan.extensions.length > 0 && this.taskPlan.extensions.find(e => e.role_id == role_id)
    );
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
    this.changedDroppedQuestions.forEach(dq => dq.dropped.isChanged = false);
    this.isDisplayingDropQuestions = false;
  }

  @action.bound async saveDropQuestions() {
    const { taskPlan } = this;

    this.pendingDroppedQuestions.forEach(dq => {
      taskPlan.dropped_questions.push(dq);
      this.planScores.dropped_questions.push(dq);
    });

    // Existing dropped Qs need to be updated to pick up allocation changes
    this.changedDroppedQuestions.forEach(h => {
      const { question_id, drop_method } = h.dropped;
      taskPlan.dropped_questions.find(dq => dq.question_id == question_id).drop_method = drop_method;
    });

    await taskPlan.saveDroppedQuestions();
    await this.planScores.fetch();
    this.cancelDisplayingDropQuestions();
  }

  droppedQuestionRecord(heading) {
    return heading.dropped || this.pendingDroppedQuestions.get(heading.question_id);
  }

  @computed get changedDroppedQuestions() {
    return this.scores.question_headings.filter(h => h.dropped && h.dropped.isChanged);
  }

  @computed get canSubmitDroppedQuestions() {
    return Boolean(
      this.changedDroppedQuestions.length > 0 ||
      this.pendingDroppedQuestions.size > 0
    );
  }

  @computed get isDroppedQuestionsSaving() {
    return this.taskPlan.api.isWriteInProgress;
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

  @action.bound async onEdit() {
    await this.taskPlan.fetch();

    this.editUX = new EditUX();

    await this.editUX.initialize({
      ...this.params,
      id: this.taskPlan.id,
      history,
      course: this.course,
    });

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

  @action.bound async onPublishScores() {
    await this.taskingPlan.publishScores();

    await this.planScores.fetch();
    await this.planScores.taskPlan.fetch();
    await this.planScores.taskPlan.analytics.fetch();
    await this.planScores.ensureExercisesLoaded();
  }

  @computed get isPublishingScores() {
    return Boolean(
      this.taskingPlan && this.taskingPlan.api.isPending
    );
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
    return Boolean((this.planScores.isHomework || this.planScores.isReading) && this.scores);
  }

  @computed get canDisplayGradingButton() {
    return Boolean(this.taskingPlan.isPastDue && this.scores.hasAnyResponses);
  }

  @computed get hasUnPublishedScores() {
    return Boolean(this.scores.hasUnPublishedScores);
  }

  @computed get gradeableQuestionCount() {
    return sumBy(this.scores.question_headings.map(qh => qh.gradedStats), 'remaining');
  }

  @computed get hasGradeableAnswers() {
    return Boolean(this.gradeableQuestionCount > 0);
  }

  @computed get overallAverageScore() {
    if (!this.taskingPlan.isPastDue) { return '---'; }
    return this.displayTotalInPercent ?
      this.scores.totalAverageScoreInPercent : this.scores.totalAverageScoreInPoints;
  }

  @action.bound scrollToQuestion(questionId, index) {
    this.freeResponseQuestions.set(get(this.scores, `questionsInfo[${index}].id`), true);
    scrollIntoView(document.querySelector(`[data-question-id="${questionId}"]`), {
      time: 300,
      align: { top: 0, topOffset: 80 },
    });
  }

  getReadingCountData(student) {
    const completedQuestions = filter(student.questions, 'is_completed');
    return {
      total: student.questions.length,
      complete: completedQuestions.length,
      correct: filter(completedQuestions, cq => cq.is_correct).length,
      incorrect: filter(completedQuestions, cq => !cq.is_correct).length,
    };
  }


}
