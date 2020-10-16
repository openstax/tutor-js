import { action, computed } from 'mobx';
import { find, map } from 'lodash';
import Map from 'shared/model/map';
import PracticeQuestion from './practice-questions/practice-question';

class PracticeQuestions extends Map {
  static Model = PracticeQuestion

  constructor({ course }) {
    super();
    this.course = course;
  }

  fetch() {
    return { courseId: this.course.id };
  }

  @action onLoaded({ data: questions }) {
    this.mergeModelData(questions);
  }

  @action onQuestionDeleted(question) {
    this.delete(question.id);
  }

  @computed get isAnyPending() { 
    return Boolean(this.array.find(e => e.api.isPending));
  }

  findByExerciseId(exerciseId) {
    return find(this.array, ['exercise_id', parseInt(exerciseId, 10)]);
  }

  getAllExerciseIds() {
    return map(this.array, a => a.exercise_id);
  }

  async create({ tasked_exercise_id }) {
    const question = new PracticeQuestion({
      tasked_exercise_id: tasked_exercise_id,
    }, this);
    // add the question to the array with a pending key
    // this is to track the state of the request
    this.set('pending', question);
    await question.save();
  }

}

export { PracticeQuestion, PracticeQuestions };
