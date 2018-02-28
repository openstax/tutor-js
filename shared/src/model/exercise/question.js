import {
  BaseModel, identifiedBy, identifier, field, hasMany,
} from '../../model';
import Answer from './answer';
import Solution from './solution';
import Format from './format';

@identifiedBy('exercise/question')
export default class ExerciseQuestion extends BaseModel {

  @identifier id;
  @field is_answer_order_important;
  @field stem_html;
  @field stimulus_html;
  @field({ type: 'array' }) hints;
  @hasMany({ model: Format }) formats;
  @hasMany({ model: Answer, inverseOf: 'question' }) answers;
  @hasMany({ model: Solution, inverseOf: 'question' }) collaborator_solutions;

}
