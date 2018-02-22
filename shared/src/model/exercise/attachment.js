import {
  BaseModel, identifiedBy, identifier, field, identifier, hasMany,
} from '../../model';


@identifiedBy('exercise/attachment')
export default class ExerciseAttachment extends BaseModel {

  @identifier id;

}
