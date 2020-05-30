import { observable, action, computed } from 'vendor';
import { first, filter, isEmpty, meanBy, findIndex } from 'lodash';
import Courses from '../../models/courses-map';
import ScrollTo from '../../helpers/scroll-to';
import Grade from '../../models/task-plans/teacher/grade';
import UiSettings from 'shared/model/ui-settings';

export default class AssignmentGradingUX {

  @observable exercisesHaveBeenFetched = false;
  @observable selectedPeriod;
  @observable selectedHeadingIndex = 0;
  @observable expandGradedAnswers = false;

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
  }

  @computed get isScoresReady() { return this.planScores.api.hasBeenFetched; }
  @computed get isExercisesReady() { return this.isScoresReady && this.exercisesHaveBeenFetched; }

  @computed get scores() {
    return this.planScores.tasking_plans.find(tp => this.selectedPeriod.id == tp.period_id);
  }

  @computed get visibleResponses() {
    let responses = this.selectedHeading.studentResponses;
    if (this.showOnlyAttempted) {
      responses = filter(responses, 'is_completed');
    }
    if (!this.expandGradedAnswers) {
      responses = filter(responses, 'needs_grading');
    }
    return responses;
  }

  @computed get averageScoreForGradedStudents() {
    const gradedResponses = filter(this.selectedHeading.studentResponses, sr => !sr.needs_grading);
    return meanBy(gradedResponses, gr => gr.gradedPoints);
  }

  @computed get selectedHeading() {
    return this.headings[this.selectedHeadingIndex];
  }

  @computed get headings() {
    return this.scores.question_headings.gradable();
  }

  @computed get unGraded() {
    return filter(this.selectedHeading.studentResponses, s => s.needs_grading);
  }

  wasQuestionViewed(index) {
    return this.viewedQuestions.get(index);
  }

  markQuestionViewed(index) {
    this.viewedQuestions.set(index, true);
  }

  @action async saveScore({ response, points, comment }) {
    const grade = new Grade({ points, comment, response });
    await grade.save();
    //refetch scores after grade was saved
    await this.planScores.fetch();
    await this.planScores.ensureExercisesLoaded();
    
    // move to next question if any
    if (isEmpty(this.unGraded)) {
      if (this.selectedHeadingIndex < this.headings.length - 1)
        this.selectedHeadingIndex += 1;
    }
  }

  @computed get taskingPlan() {
    return this.planScores.taskPlan.tasking_plans.forPeriod(this.selectedPeriod);
  }

  @action.bound async onPublishScores() {
    this.taskingPlan.publishScores();
  }

  @action.bound setSelectedPeriod(period) {
    this.selectedPeriod = period;
  }
}
