import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
} from 'shared/model';
import { computed, action } from 'mobx';
import moment from 'moment';
import Time from '../time';

export default
@identifiedBy('course/role')
class CourseRole extends BaseModel {

  @identifier id;
  @field({ type: 'date' }) joined_at;
  @field type;
  @field period_id;
  @field research_identifier;
  @belongsTo({ model: 'course' }) course;

  @computed get isStudentLike() {
    return Boolean(this.isStudent || this.isTeacherStudent);
  }

  @computed get isStudent() {
    return this.type == 'student';
  }

  @computed get isTeacherStudent() {
    return this.type == 'teacher_student';
  }

  @computed get isTeacher() {
    return this.type == 'teacher';
  }

  joinedAgo(terms = 'days') {
    return moment(Time.now).diff(this.joined_at, terms);
  }

  @action async become({ reset = true } = {}) {
    if (reset) {
      this.course.clearCachedStudentData();
    }
    this.course.current_role_id = this.id;
  }
}
