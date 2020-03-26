import { observable, action, computed } from 'vendor';
import { first } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import TaskPlanScores from '../../models/task-plans/teacher/scores';
import Exercises from '../../models/exercises';

export default class AssignmentReviewUX {

  @observable selectedPeriod;
  @observable exercisesHaveBeenFetched = false

  freeResponseQuestions = observable.map();

  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, scores, course,
    windowImpl = window,
  }) {
    this.scroller = new ScrollTo({ windowImpl });
    this.planScores = scores || new TaskPlanScores({ id, course });
    this.course = course;
    this.selectedPeriod = first(course.periods.active);

    await this.planScores.fetch();

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
    return this.planScores.periods.find(period => this.selectedPeriod.period_id == period.id);
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
}
