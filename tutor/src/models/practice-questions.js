import { action } from 'mobx';
import { find } from 'lodash';
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

  @action findByExerciseId(exerciseId) {
    return find(this.array, ['exercise_id', exerciseId]);
  }

  async create({ tasked_exercise_id }) {
    const question = new PracticeQuestion({
      tasked_exercise_id: tasked_exercise_id,
    }, this);
    await question.save();
    return question;
  }

}

export { PracticeQuestion, PracticeQuestions };
