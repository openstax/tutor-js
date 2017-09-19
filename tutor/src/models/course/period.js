import { find, pick } from 'lodash';
import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
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

  @belongsTo({ model: 'course' }) course;

  isNameValid( name ) {
    return Boolean(
      this.name == name || !find(this.course.periods, { name })
    );
  }

  // called from API
  save() { }
  create() {
    return { courseId: this.course.id, data: pick(this, 'name') };
  }
  archive() { }
  unarchive() {
    return { id: this.id, data: { is_archived: false } };
  }
  afterCreate({ data }) {
    this.update(data);
    this.course.periods.push(this);
  }


}
