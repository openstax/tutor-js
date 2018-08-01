import {
  BaseModel, identifiedBy, identifier, field, hasMany,
} from '../../model';


@identifiedBy('exercise/author')
export default class ExerciseAuthor extends BaseModel {

  @identifier user_id;
  @field name;
}
