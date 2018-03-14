import { get, first, find, reduce, isEmpty } from 'lodash';
import {
  BaseModel, identifiedBy, identifier, field, hasMany, computed,
} from '../../model';
import Answer from './answer';
import Solution from './solution';
import Format from './format';

@identifiedBy('exercise/question')
export default class ExerciseQuestion extends BaseModel {

  @identifier id;
  @field is_answer_order_important = false;
  @field stem_html;
  @field stimulus_html;
  @field({ type: 'array' }) hints;
  @hasMany({ model: Format }) formats;
  @hasMany({ model: Answer, inverseOf: 'question' }) answers;
  @hasMany({ model: Solution, inverseOf: 'question' }) collaborator_solutions;

  @computed get isMultipleChoice() {
    return this.hasFormat('multiple-choice');
  }

  hasFormat(name) {
    return Boolean(find(this.formats, { asString: name }));
  }

  @computed get solution_html() {
    get(first(this.collaborator_solutions, 'content_html'), '');
  }

  @computed get validity() {
    if (isEmpty(this.stem_html)){
      return { valid: false, part: 'Question Stem' };
    }

    return reduce(this.answers, (memo, answer) => ({
      valid: memo.valid && answer.validity.valid,
      part: memo.part || answer.validity.part,
    }) , { valid: true });
  }

}
