import { React, observable, action, computed } from 'vendor';
import { first } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import TaskPlanScores from '../../models/task-plans/teacher/scores';
import DropQuestion from '../../models/task-plans/teacher/dropped_question';
import Exercises from '../../models/exercises';
import EditUX from '../assignment-edit/ux';
import DetailsBody from '../assignment-edit/details-body';

export default class AssignmentReviewUX {

  @observable selectedPeriod;
  @observable exercisesHaveBeenFetched = false;
  @observable isDisplayingGrantExtension = false;
  @observable isDisplayingDropQuestions = false;
  @observable isDisplayingConfirmDelete = false;
  @observable isDisplayingEditAssignment = false;

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
    return this.planScores.tasking_plans.forPeriod(this.selectedPeriod);
  }

  @computed get sortedStudents() {
    return this.scores.students; // TODO: sort this ;)
  }

  isShowingFreeResponseForQuestion(question) {
    return Boolean(this.freeResponseQuestions.get(question.id));
  }

  @action.bound toggleFreeResponseForQuestion(question) {
    this.freeResponseQuestions.set(question.id, !this.isShowingFreeResponseForQuestion(question));
  }

  @action.bound onSearchStudentChange() {

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
    await this.planScores.taskPlan.destroy();
    this.onCompleteDelete();
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
    Object.assign(this.planScores, this.editUX.plan);
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

}
