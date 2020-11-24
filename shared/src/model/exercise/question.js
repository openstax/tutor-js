import { uniq, map, keys, inRange, find, reduce, isEmpty, without, every, omit } from 'lodash';
import {
  BaseModel, identifiedBy, identifier, field, belongsTo, hasMany, computed, action,
} from '../../model';
import Answer from './answer';
import Solution from './solution';
import Format from './format';
import invariant from 'invariant';

export
class ReviewQuestion {
  constructor(question) {
    this.q = question;
  }
  get id() { return this.q.question_id; }
  @computed get answers() { return this.q.answer_stats; }
  @computed get formats() { return this.q.content.formats; }
  @computed get stem_html(){ return this.q.content.stem_html; }
  @computed get stimulus_html() { return this.q.content.stimulus_html; }
}


export default
@identifiedBy('exercise/question')
class ExerciseQuestion extends BaseModel {

  static FORMAT_TYPES = {
    'open-ended': 'Open Ended',
    'multiple-choice': 'Multiple Choice',
    'true-false': 'True/False',
  };

  @identifier id;
  @field is_answer_order_important = false;
  @field stem_html = '';
  @field stimulus_html = ''
  @field({ type: 'array' }) hints;
  @hasMany({ model: Format, inverseOf: 'question' }) formats;
  @hasMany({ model: Answer, inverseOf: 'question' }) answers;
  @hasMany({ model: Solution, inverseOf: 'question' }) collaborator_solutions;

  @belongsTo({ model: 'exercise' }) exercise;

  @computed get allowedFormatTypes() {
    const type = this.exercise.tags.withType('type');
    if (type && type.value != 'practice') {
      return omit(ExerciseQuestion.FORMAT_TYPES, 'open-ended');
    }
    return ExerciseQuestion.FORMAT_TYPES;
  }

  @computed get isMultipleChoice() {
    return this.hasFormat('multiple-choice');
  }

  @computed get isOpenEnded() {
    return Boolean(this.formats.length == 1 && this.hasFormat('free-response'));
  }

  //WRM is OpenEnded and have no answers
  @computed get isWrittenResponse() {
    return this.isOpenEnded && this.answers.length === 0;
  }

  hasFormat(value) {
    if (value == 'open-ended') { return this.isOpenEnded; }
    return Boolean(find(this.formats, { value }));
  }

  @computed get index() {
    return this.exercise.questions.indexOf(this);
  }

  set uniqueFormatType(type) {
    if (this.formats.length) {
      this.formats[0].value;
    } else {
      this.formats.push(new Format(type));
    }
  }

  @computed get collaborator_solution_html() {
    return this.collaborator_solutions.length ?
      this.collaborator_solutions[0].content_html : '';
  }

  set collaborator_solution_html(val) {
    if (!val) {
      if (this.collaborator_solutions.length) {
        this.collaborator_solutions.clear();
      }
    } else {
      if (!this.collaborator_solutions.length) {
        this.collaborator_solutions.push({});
      }
      this.collaborator_solutions[0].content_html = val;
    }
  }

  @computed get formatId() {
    if (this.isMultipleChoice) {
      return 'MC';
    }
    return 'UNK';
  }

  @computed get requiresChoicesFormat() {
    return !this.hasFormat('free-response');
  }

  @computed get isTwoStep() {
    return Boolean(this.hasFormat('multiple-choice') && this.hasFormat('free-response'));
  }

  @action setExclusiveFormat(name) {
    if (name == 'open-ended') { name = 'free-response'; }

    let formats = without(map(this.formats, 'value'), ...keys(ExerciseQuestion.FORMAT_TYPES));
    formats.push(name);
    if ('true-false' === name) {
      formats = without(formats, 'free-response');
      if (this.answers.length == 0) {
        this.answers.push({ content_html: 'True' });
        this.answers.push({ content_html: 'False' });
      }
    } else if ('multiple-choice' === name && !formats.includes('free-response')) {
      formats = formats.concat('free-response');
    } else if (name == 'free-response') {
      this.exercise.onQuestionFreeResponseSelected(this);
    }
    this.formats = uniq(formats).sort();
  }

  @action toggleFormat(value, selected) {
    invariant(!ExerciseQuestion.FORMAT_TYPES[value], 'cannot toggle exclusive formats');

    if (selected && !this.hasFormat(value)) {
      this.formats.push(value);
    } else if (!selected) {
      this.formats.remove(find(this.formats, { value }));
    }
  }

  @computed get validity() {
    if (isEmpty(this.formats)) {
      return { valid: false, part: 'Question Format' };
    }
    if (isEmpty(this.stem_html)){
      return { valid: false, part: 'Question Stem' };
    }
    if(!this.isOpenEnded) {
      if (isEmpty(this.answers)) { return { valid: false, part: 'Answer' }; }
      // make sure that one correct answer is selected
      if (every(this.answers, a => !a.isCorrect)) {return { valid: false, part: 'Correct Answer' }; }
    }
    return reduce(this.answers, (memo, answer) => ({
      valid: memo.valid && answer.validity.valid,
      part: memo.part || answer.validity.part,
    }) , { valid: true });
  }

  @action setCorrectAnswer(correctAnswer) {
    this.answers.forEach((a) => { a.correctness = ( (a === correctAnswer) ? '1.0' : '0.0' ); });
  }

  @action moveAnswer(answer, offset) {
    const index = this.answers.indexOf(answer);
    invariant((index !== -1) && inRange(index+offset, 0, this.answers.length),
      'question not found or cannot move past bounds');
    this.answers.splice(index+offset, 0, this.answers.splice(index, 1)[0]);
  }

}
