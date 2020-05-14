import { observable, action, computed } from 'vendor';
import { first, filter, isEmpty } from 'lodash';
import Courses from '../../models/courses-map';
import ScrollTo from '../../helpers/scroll-to';
import TaskPlanScores from '../../models/task-plans/teacher/scores';
import Exercises from '../../models/exercises';
import Grade from '../../models/task-plans/teacher/grade';
import UiSettings from 'shared/model/ui-settings';

export default class AssignmentGradingUX {

  @observable exercisesHaveBeenFetched = false;
  @observable selectedPeriod;
  @observable selectedHeading;
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
    id, periodId, courseId, scores, course,
    windowImpl = window,
  }) {

    this.scroller = new ScrollTo({ windowImpl });
    this.course = course || Courses.get(courseId);
    this.selectedPeriod = this.course.periods.active.find(p => p.id == periodId) ||
      first(this.course.periods.active);
    this.planScores = scores || new TaskPlanScores({ id, course: this.course });
    await this.planScores.fetch();

    await Exercises.ensureExercisesLoaded({ course: this.course, exercise_ids: this.planScores.exerciseIds });

    this.setHeading(this.headings[0]);

    this.exercisesHaveBeenFetched = true;
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

  @computed get headings() {
    return this.scores.question_headings.gradable();
  }

  @computed get unGraded() {
    return filter(this.studentResponses, s => s.needs_grading);
  }

  wasQuestionViewed(index) {
    return this.viewedQuestions.get(index);
  }

  markQuestionViewed(index) {
    this.viewedQuestions.set(index, true);
  }

  setHeading(heading) {
    //this.markQuestionViewed(index);
    this.selectedHeading = heading;
  }

  @action async saveScore({ response, points, comment }) {
    const grade = new Grade({ points, comment, response });
    await grade.save();

    if (isEmpty(this.unGraded)) {
      const nextHeadingIndex = this.headings.indexOf(this.selectedHeading) + 1;
      if (nextHeadingIndex < this.headings.length + 1) {
        this.setHeading(this.headings[nextHeadingIndex]);
      }
    }
  }

}
