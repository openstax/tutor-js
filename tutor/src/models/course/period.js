import { find, pick } from 'lodash';
import { computed } from 'mobx';
import {
  BaseModel, identifiedBy, field, identifier, belongsTo, session,
} from '../base';

@identifiedBy('course/period')
export default class CoursePeriod extends BaseModel {
  @identifier id;

  @field name;
  @session default_due_time;
  @session default_open_time;
  @session enrollment_code;
  @session enrollment_url;
  @session is_archived;
  @session teacher_student_role_id;

  @session num_enrolled_students = 0;

  @belongsTo({ model: 'course' }) course;

  @computed get scores() {
    return this.course.scores.periods.get(this.id);
  }

  @computed get hasEnrollments() {
    return this.num_enrolled_students > 0;
  }

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
