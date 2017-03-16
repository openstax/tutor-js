import {
  BaseModel, identifiedBy, field, identifier,
} from '../base';

@identifiedBy('course/period')
export default class CoursePeriod extends BaseModel {
  @identifier id;

  @field name;
  @field default_due_time;
  @field default_open_time;
  @field enrollment_code;
  @field enrollment_url;
  @field is_archived;
  @field teacher_student_role_id;
}
