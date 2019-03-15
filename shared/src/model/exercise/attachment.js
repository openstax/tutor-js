import {
  BaseModel, identifiedBy, identifier, field, belongsTo,
} from '../../model';


export default
@identifiedBy('exercise/attachment')
class ExerciseAttachment extends BaseModel {

  @identifier id;

  @belongsTo({ type: 'exercise' }) exercise;

  @field({ type: 'object' }) asset;

}
