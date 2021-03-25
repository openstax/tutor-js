import {
    BaseModel, field, identifier, model, computed,
} from 'shared/model';

import User from '../user';

export default class CourseTeacher extends BaseModel {

  @identifier id;
  @field role_id;
  @field first_name = '';
  @field last_name = '';
  @field role_id;
  @field is_active;

  @model('course/roster') roster;

  drop() {
      return { id: this.id };
  }

  @computed get isTeacherOfCourse() {
      return this.roster.course.primaryRole.id === this.role_id;
  }

  onDropped() {
      this.roster.teachers.remove(this);
      if (this.isTeacherOfCourse){
          User.removeCourse(this.roster.course);
      }
  }
}
