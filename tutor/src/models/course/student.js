import {
  BaseModel, identifiedBy, field, identifier,
} from '../base';

@identifiedBy('course/student')
export default class CourseStudent extends BaseModel {
  @identifier id;

  @field name;

}
