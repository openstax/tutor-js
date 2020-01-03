import {
  BaseModel, identifiedBy, identifier, field,
} from '../../model';


export default
@identifiedBy('exercise/author')
class ExerciseAuthor extends BaseModel {

  @identifier user_id;
  @field name;
}
