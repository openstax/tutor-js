import {
  BaseModel, identifiedBy, identifier, field, hasMany,
} from '../../model';


export default
@identifiedBy('exercise/attachment')
class ExerciseAttachment extends BaseModel {

  @identifier id;

  @field({ type: 'object' }) asset;

};
