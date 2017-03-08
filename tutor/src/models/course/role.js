import {
  BaseModel, identifiedBy, field, identifier,
} from '../base';

@identifiedBy('course/role')
export default class CourseRole extends BaseModel {
  @identifier id;

  @field joined_at;
  @field type;
}
