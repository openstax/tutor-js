import { filter } from 'lodash';
import {
  BaseModel, identifiedBy, field, hasMany, computed,
} from '../base';

import Teacher from './teacher';
import Student from './student';

@identifiedBy('course/roster')
export default class CourseRoster extends BaseModel {

  @field teach_url;

  @hasMany({ model: Teacher, inverseOf: 'roster' }) teachers;
  @hasMany({ model: Student, inverseOf: 'roster' }) students;

  constructor(course) {
    super();
    this.course = course;
  }


  fetch() {
    return { courseId: this.course.id };
  }

  studentsForPeriod(period) {
    return filter(this.students, { is_active: true, period_id: period.id });
  }

  @computed get droppedStudents() {
    return filter(this.students, { is_active: false });
  }
}
