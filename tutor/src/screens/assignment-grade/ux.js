import { observable, action, computed } from 'vendor';
import { first, filter, isEmpty, findIndex } from 'lodash';
import Courses from '../../models/courses-map';
import ScrollTo from '../../helpers/scroll-to';
import Grade from '../../models/task-plans/teacher/grade';
import UiSettings from 'shared/model/ui-settings';

export default class AssignmentGradingUX {

  @observable exercisesHaveBeenFetched = false;
  @observable selectedPeriod;

  @observable selectedHeadingIndex = 0;
  @observable expandGradedAnswers = false;
  @observable selectedStudentIndex = 0;
  @observable showOverview = false;

  @observable isPublishingScores = false;
  @observable selectedHeadingStudentsIsGrading = [];

  @UiSettings.decorate('grd.hsn') hideStudentNames = false;
  @UiSettings.decorate('grd.alpr') alphabetizeResponses = false;
  @UiSettings.decorate('grd.soa') showOnlyAttempted = false;
  @UiSettings.decorate('grd.sak') showAnswerKey = false;

  viewedQuestions = observable.map();
  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, periodId, courseId, course, questionId,
    scores = course.teacherTaskPlans.withPlanId(id).scores,
    windowImpl = window,
  }) {

    this.scroller = new ScrollTo({ windowImpl });
    this.course = course || Courses.get(courseId);
    this.selectedPeriod = this.course.periods.active.find(p => p.id == periodId) ||
      first(this.course.periods.active);
    this.planScores = scores;

    await this.planScores.fetch();
    await this.planScores.taskPlan.fetch();
    await this.planScores.taskPlan.analytics.fetch();
    await this.planScores.ensureExercisesLoaded();

    this.exercisesHaveBeenFetched = true;

    if (questionId) {
      const index = findIndex(this.headings, (h => h.question_id == questionId ));
      if (index > -1) { this.selectedHeadingIndex = index; }
    }
    else {
      let index = findIndex(this.headings, (h => !h.gradedStats.complete));
      if (index <= -1) { index = 0; }
      this.selectedHeadingIndex = index;
    }
  }

  @computed get isScoresReady() { return this.planScores.api.hasBeenFetched; }
  @computed get isExercisesReady() { return this.isScoresReady && this.exercisesHaveBeenFetched; }

  @computed get scores() {
    return this.planScores.tasking_plans.find(tp => this.selectedPeriod.id == tp.period_id);
  }

  @computed get assignedPeriods() {
    return this.planScores.taskPlan.activeAssignedPeriods;
  }

  @computed get gradedResponses() {
    return filter(this.selectedHeading.studentResponses, sr => {
      if(this.showOnlyAttempted) {
        return sr.is_completed && sr.grader_points !== undefined;
      }
      return sr.grader_points !== undefined;
    });
  }

  @computed get needsGradingResponses() {
    return filter(this.selectedHeading.studentResponses, sr => {
      if(this.showOnlyAttempted) {
        return sr.is_completed && sr.grader_points === undefined;
      }
      return sr.grader_points === undefined;
    });
  }

  @computed get unAttemptedResponses() {
    return filter(this.selectedHeading.studentResponses, sr => !sr.needs_grading && !sr.is_completed);
  }

  @computed get selectedHeading() {
    return this.headings[this.selectedHeadingIndex];
  }

  @computed get isLastQuestion() {
    return this.selectedHeadingIndex === this.headings.length - 1;
  }

  @computed get headings() {
    return this.scores.question_headings.gradable();
  }

  @computed get unGraded() {
    return filter(this.selectedHeading.studentResponses, s => s.needs_grading);
  }

  @computed get hasUnpublishedScores() {
    return this.scores.hasUnPublishedScores;
  }

  @computed get isLastStudent() {
    return this.needsGradingResponses.length === 1;
  }

  wasQuestionViewed(index) {
    return this.viewedQuestions.get(index);
  }

  markQuestionViewed(index) {
    this.viewedQuestions.set(index, true);
  }

  isResponseGraded(response) {
    return response.grader_points !== undefined;
  }

  @action async saveScore({ points, comment, response, doGoToOverview = false, doMoveNextQuestion = false }) {
    const grade = new Grade({ points, comment, response });
    await grade.save();
    //refetch scores after grade was saved
    await this.planScores.fetch();
    await this.planScores.taskPlan.fetch();
    await this.planScores.taskPlan.analytics.fetch();
    await this.planScores.ensureExercisesLoaded();

    if(doGoToOverview) {
      this.goToOverview();
    }
    // move to next question if any
    else if (isEmpty(this.unGraded) && doMoveNextQuestion) {
      if (this.selectedHeadingIndex < this.headings.length - 1){
        this.selectedHeadingIndex += 1;
      }
    }
    // go back to first student when grading the last student in the list and have some other students who were skipped
    else if (this.selectedStudentIndex >= this.unGraded.length) {
      this.selectedStudentIndex = 0;
    }
  }

  @computed get taskingPlan() {
    return this.planScores.taskPlan.tasking_plans.forPeriod(this.selectedPeriod);
  }

  @action.bound async onPublishScores() {
    this.isPublishingScores = true;
    await this.taskingPlan.publishScores();
    //refetch scores after publish scores was saved
    await this.planScores.fetch();
    await this.planScores.taskPlan.fetch();
    await this.planScores.taskPlan.analytics.fetch();
    await this.planScores.ensureExercisesLoaded();
    this.isPublishingScores = false;
  }

  @action.bound setSelectedPeriod(period) {
    this.selectedPeriod = period;
  }

  @action.bound goToQuestionHeading(index, expandGradedAnswers = false) {
    this.selectedHeadingIndex = index;
    this.expandGradedAnswers = expandGradedAnswers;
    this.selectedStudentIndex = 0;
    this.showOverview = false;
  }

  @action.bound goToOverview() {
    this.selectedHeadingIndex = undefined;
    this.expandGradedAnswers = false;
    this.selectedStudentIndex = 0;
    this.showOverview = true;
  }
}
