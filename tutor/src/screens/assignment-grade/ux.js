import { observable, action, computed } from 'vendor';
import { first, filter } from 'lodash';
import Courses from '../../models/courses-map';
import ScrollTo from '../../helpers/scroll-to';
import TaskPlanScores from '../../models/task-plans/teacher/scores';
import Exercises from '../../models/exercises';

export default class AssignmentGradingUX {

  @observable exercisesHaveBeenFetched = false
  @observable selectedPeriod
  @observable questionIndex = 0;

  viewedQuestions = observable.map();
  gradedAnswers = observable.map();

  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, courseId, scores, course,
    windowImpl = window,
  }) {

    this.scroller = new ScrollTo({ windowImpl });
    this.course = course || Courses.get(courseId);
    this.selectedPeriod = first(this.course.periods.active);
    this.planScores = scores || new TaskPlanScores({ id, course: this.course });
    this.setQuestionIndex(0);

    await this.planScores.fetch();

    await Exercises.ensureExercisesLoaded({ course: this.course, exercise_ids: this.planScores.exerciseIds });
    this.exercisesHaveBeenFetched = true;
  }

  @computed get isScoresReady() { return this.planScores.api.hasBeenFetched; }
  @computed get isExercisesReady() { return this.isScoresReady && this.exercisesHaveBeenFetched; }

  @computed get scores() {
    return this.planScores.periods.find(period => this.selectedPeriod.period_id == period.id);
  }

  @computed get selectedQuestion() {
    const info = this.scores.students[0].questions[this.questionIndex];
    const exercise = Exercises.get(info.exercise_id);
    if (exercise) {
      return exercise.content.questions.find(q => q.id == info.id);
    }
    return null;
  }

  @computed get unViewedStudents() {
    return filter(this.scores.students, s => !this.hasViewedStudentQuestion(this.selectedQuestion, s));
  }

  wasQuestionViewed(index) {
    return this.viewedQuestions.get(index);
  }

  markQuestionViewed(index) {
    this.viewedQuestions.set(index, true);
  }

  setQuestionIndex(index) {
    this.markQuestionViewed(index);
    this.questionIndex = index;
  }

  hasViewedStudentQuestion(question, student) {
    return this.gradedAnswers.get(`${question.id}-${student.id}`);
  }

  @action saveScore({ student, question, points, comment }) {
    this.gradedAnswers.set(`${question.id}-${student.id}`, {
      points, comment, question, student,
    });
  }

}
