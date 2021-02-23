import {
  BaseModel, identifiedBy, identifier, field,
} from '../../model';


@identifiedBy('exercise/author')
export default
class ExerciseAuthor extends BaseModel {

  @identifier user_id;
  @field name;
}
