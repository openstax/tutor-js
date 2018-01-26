import { filter, find } from 'lodash';
import { computed, observable, action } from 'mobx';
import {
  BaseModel, identifiedBy, field, hasMany, session, belongsTo,
} from '../base';
import { TimeStore } from '../../flux/time';

import TaskResult from './scores/task-result';

@identifiedBy('course/scores/student')
class Student extends BaseModel {
  @hasMany({ model: TaskResult, inverseOf: 'student' }) data;
  @session first_name;
  @session last_name;
  @session is_dropped;
  @session name;
  @session role;
  @session student_identifier;

  @session course_average = 0;
  @session homework_score = 0;
  @session homework_progress = 0;
  @session reading_score = 0;
  @session reading_progress = 0;
}

@identifiedBy('course/scores/heading')
class Heading extends BaseModel {
  @session average_score = 0;
  @session completion_rate = 0;
  @session({ type: 'date' }) due_at;
  @session plan_id;
  @session title;
  @session type;
  @belongsTo({ model: 'course/scores/period' }) period;
}

@identifiedBy('course/scores/period')
export class CourseScoresPeriod extends BaseModel {

  @hasMany({ model: Heading }) data_headings;

  @session overall_course_average = 0;
  @session overall_reading_score = 0;
  @session overall_reading_progress = 0;
  @session overall_homework_score = 0;
  @session overall_homework_progress = 0;

  @session period_id;
  @hasMany({ model: Student, inverseOf: 'period' }) students;

  constructor(attrs, course) {
    super(attrs);
    this.course = course;
  }

  @computed get courseStudents() {
    return this.course.roster.students.activeByPeriod[this.period_id] || [];
  }

  @computed get numAssignments() {
    return this.data_headings.length;
  }

  @computed get coursePeriod() {
    return find(this.course.periods, { id: this.period_id });
  }

}

@identifiedBy('course/scores')
export default class CourseScores extends BaseModel {

  @belongsTo({ model: 'course' }) course;

  @observable periods = observable.map();

  fetch() {
    return { courseId: this.course.id };
  }

  @action onFetchComplete({ data }) {
    data.forEach(s => this.periods.set(s.period_id, new CourseScoresPeriod(s, this.course)));
  }

  getTask(taskId) {
    const id = Number(taskId);
    const periods = this.periods.values();
    for(let p=0; p < periods.length; p+=1) {
      const period = periods[p];
      for(let i=0; i < period.students.length; i +=1 ){
        const task = find(period.students[i].data, { id });
        if (task) return task;
      }
    }
    return null;
  }

}
