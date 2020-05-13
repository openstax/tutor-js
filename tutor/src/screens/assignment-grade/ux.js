import { observable, action, computed } from 'vendor';
import { first, find, filter, isEmpty } from 'lodash';
import Courses from '../../models/courses-map';
import ScrollTo from '../../helpers/scroll-to';
import TaskPlanScores from '../../models/task-plans/teacher/scores';
import Exercises from '../../models/exercises';
import Grade from '../../models/task-plans/teacher/grade';

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
    id, periodId, courseId, scores, course,
    windowImpl = window,
  }) {

    this.scroller = new ScrollTo({ windowImpl });
    this.course = course || Courses.get(courseId);
    this.selectedPeriod = this.course.periods.active.find(p => p.id == periodId) ||
      first(this.course.periods.active);
    this.planScores = scores || new TaskPlanScores({ id, course: this.course });
    this.setQuestionIndex(0);

    await this.planScores.fetch();

    await Exercises.ensureExercisesLoaded({ course: this.course, exercise_ids: this.planScores.exerciseIds });
    this.exercisesHaveBeenFetched = true;
  }

  @computed get isScoresReady() { return this.planScores.api.hasBeenFetched; }
  @computed get isExercisesReady() { return this.isScoresReady && this.exercisesHaveBeenFetched; }

  @computed get scores() {
    return this.planScores.tasking_plans.find(tp => this.selectedPeriod.id == tp.period_id);
  }

  @computed get selectedQuestion() {
    const studentQuestion = this.scores.students[0].questions[this.questionIndex];

    const exercise = Exercises.get(studentQuestion.exercise_id);
    if (exercise) {
      return exercise.content.questions.find(q => q.id == studentQuestion.question_id);
    }
    return null;
  }

  @computed get unGradedStudents() {
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
    return Boolean(this.gradedAnswers.get(`${question.id}-${student.role_id}`));
  }

  @action async saveScore({ student, question, points, comment }) {
    const grade = new Grade({ question, points, comment });
    await grade.save();
    this.gradedAnswers.set(`${question.question_id}-${student.role_id}`, {
      points, comment, question, student,
    });
    if (isEmpty(this.unGradedStudents) && this.questionIndex < this.scores.question_headings.length) {
      this.questionIndex += 1;
      this.scroller.scrollToSelector('.questions-bar');
    }
  }

  @computed get currentStudentQuestionInfo() {
    const student = first(this.unGradedStudents);
    return student.questions.find(q => q.id == this.selectedQuestion.question_id);
  }

  @computed get selectedAnswerId() {
    return this.currentStudentQuestionInfo ? this.currentStudentQuestionInfo.selected_answer_id : null;
  }

  @computed get correctAnswerid() {
    const correct = find(this.selectedQuestion.answers, 'isCorrect');
    return correct ? correct.id : null;
  }

}
