import {
  BaseModel, identifiedBy, identifier, field, hasMany,
} from '../../model';


@identifiedBy('exercise/attachment')
export default class ExerciseAttachment extends BaseModel {

  @identifier id;

  @field({ type: 'object' }) asset;

}
