import {
  BaseModel, identifiedBy, field, hasMany, belongsTo,
} from '../../model';

export default
@identifiedBy('exercise/solution')
class ExerciseSolution extends BaseModel {

  @field content_html = '';
  @field solution_type = 'detailed';
  @hasMany({ model: 'exercise/attachment' }) attachments;

  // set via inverseOf
  @belongsTo({ model: 'exercise/question' }) question;
}
