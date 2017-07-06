import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
} from '../base';

@identifiedBy('course/student')
export default class CourseStudent extends BaseModel {
  @identifier id;

  @field name;

  @field first_name;
  @field last_name;
  @field is_active;
  @field is_comped;
  @field is_paid;
  @field is_refund_allowed;
  @field is_refund_pending;
  @field payment_due_at;
  @field prompt_student_to_pay;

  @field period_id;
  @field role_id;
  @field student_identifier;

  @belongsTo course;

  // called by api
  save() {
    return {
      courseId: this.course.id, data: this.serialize(),
    };
  }

  onSaved({ data }) {
    this.update(data);
  }
}
