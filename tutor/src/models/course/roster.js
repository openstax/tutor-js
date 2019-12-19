import { filter, groupBy } from 'lodash';
import {
  BaseModel, identifiedBy, field, hasMany, belongsTo,
} from 'shared/model';

import Teacher from './teacher';
import Student from './student';
import { getters } from '../../helpers/computed-property';

export default
@identifiedBy('course/roster')
class CourseRoster extends BaseModel {

  @field teach_url;

  @belongsTo({ model: 'course' }) course;

  @hasMany({ model: Teacher, inverseOf: 'roster', extend: getters({
    active() { return filter(this, t => t.is_active); },
    dropped(){ return filter(this, t => !t.is_active); },
  }) }) teachers;

  @hasMany({ model: Student, inverseOf: 'roster', extend: getters({
    active() { return filter(this, t => t.is_active); },
    activeByPeriod() { return groupBy(filter(this, t => t.is_active), 'period_id'); },
    dropped(){ return filter(this, t => !t.is_active); },
  }) }) students;

  fetch() {
    return { courseId: this.course.id };
  }

}
