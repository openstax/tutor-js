import { filter, groupBy } from 'lodash';
import {
    BaseModel, field, model,
} from 'shared/model';

import Teacher from './teacher';
import Student from './student';
import { getters } from '../../helpers/computed-property';

export default class CourseRoster extends BaseModel {

  @field teach_url;

  @model('course') course;

  @model(Teacher) teachers = []; /* extend: getters({
      active() { return filter(this, t => t.is_active); },
      dropped(){ return filter(this, t => !t.is_active); },
  }) */

  @model(Student) students = []; /* extend: getters({
      active() { return filter(this, t => t.is_active); },
      activeByPeriod() { return groupBy(filter(this, t => t.is_active), 'period_id'); },
      dropped(){ return filter(this, t => !t.is_active); },
  }) */

  fetch() {
      return { courseId: this.course.id };
  }

}
