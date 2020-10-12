import { action, observable, computed } from 'mobx';
import { sortBy, values } from 'lodash';
import {
  BaseModel, identifiedBy, hasMany, session, identifier,
} from 'shared/model';
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

  async create({ tasked_exercise_id }) {
    const question = new PracticeQuestion({
      tasked_exercise_id: tasked_exercise_id,
    }, this);
    await question.save();
    return question;
  }

}

export { PracticeQuestion, PracticeQuestions };
