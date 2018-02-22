import {
  BaseModel, identifiedBy, identifier, field, identifier, hasMany,
} from '../../model';


@identifiedBy('exercise/author')
export default class ExerciseAuthor extends BaseModel {

  @identifier id;

}
