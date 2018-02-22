import { filter, find, reduce, map, each, findIndex, groupBy, mapValues, sumBy } from 'lodash';
import { computed, observable, action } from 'mobx';
import {
  BaseModel, identifiedBy, field, hasMany, belongsTo,
} from 'shared/model';
import { TimeStore } from '../../flux/time';

import TaskResult from './scores/task-result';

@identifiedBy('course/scores/student')
class Student extends BaseModel {
  @hasMany({ model: TaskResult, inverseOf: 'student' }) data;
  @field first_name;
  @field last_name;
  @field is_dropped;
  @field name;
  @field role;
  @field student_identifier;

  @field course_average = 0;
  @field homework_score = 0;
  @field homework_progress = 0;
  @field reading_score = 0;
  @field reading_progress = 0;

  @computed get scoredStepCount() {
    return mapValues(
      groupBy(this.data, 'type'),
      tasks => sumBy(tasks, 'step_count') || 0
    );
  }

}

@identifiedBy('course/scores/heading')
class Heading extends BaseModel {
  @field average_score = 0;
  @field average_progress = 0;
  @field({ type: 'date' }) due_at;
  @field plan_id;
  @field title;
  @field type;
  @belongsTo({ model: 'course/scores/period' }) period;

  @computed get columnIndex() {
    return findIndex(this.period.data_headings, this);
  }

  @computed get tasks() {
    return map(this.period.students, (s) => s.data[this.columnIndex])
  }

  @computed get scoredStepCount() {
    return reduce(this.tasks,
      (count, task) => task.is_included_in_averages ? count + task.step_count : count,
      0);
  }

}

@identifiedBy('course/scores/period')
export class CourseScoresPeriod extends BaseModel {

  @field overall_course_average = 0;
  @field overall_reading_score = 0;
  @field overall_reading_progress = 0;
  @field overall_homework_score = 0;
  @field overall_homework_progress = 0;
  @field period_id;
  @hasMany({ model: Heading, inverseOf: 'period' }) data_headings;
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

  @computed get scoredStepCount() {
    const counts = {};
    each(this.students, (student) => {
      each(student.scoredStepCount, (count, key) => {
        counts[key] = ((counts[key] || 0) + count);
      })
    });
    return counts;
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
