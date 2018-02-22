import {
  BaseModel, identifiedBy, identifier, field, identifier, hasMany, belongsTo,
} from '../../model';

@identifiedBy('exercise/answer')
export default class ExerciseAnswer extends BaseModel {
  @identifier id;
  @field content_html;
  @field correctness;
  @field feedback_html;

  // set via inverseOf
  @belongsTo({ model: 'exercise/question' }) question;

}
