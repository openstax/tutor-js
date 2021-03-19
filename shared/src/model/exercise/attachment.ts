import {
    BaseModel, identifiedBy, identifier, field, belongsTo,
} from '../../model';


@identifiedBy('exercise/attachment')
export default
class ExerciseAttachment extends BaseModel {

  @identifier id;

  @belongsTo({ type: 'exercise' }) exercise;

  @field({ type: 'object' }) asset;

}
