import { filter, find, reduce, map, each, findIndex, groupBy, mapValues, sumBy } from 'lodash';
import { computed, observable, action } from 'mobx';
import {
  BaseModel, identifiedBy, field, hasMany, belongsTo,
} from 'shared/model';
import { TimeStore } from '../../flux/time';
import moment from 'moment';

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

  @field({ type: 'bignum' }) course_average;
  @field({ type: 'bignum' }) homework_score;
  @field({ type: 'bignum' }) homework_progress;
  @field({ type: 'bignum' }) reading_score;
  @field({ type: 'bignum' }) reading_progress;


  @computed get scoredStepCount() {
    return this._countsFor('step_count');
  }

  @computed get scoredExerciseCount() {
    return this._countsFor('exercise_count');
  }

  _countsFor(attr) {
    return mapValues(
      groupBy(this.data, 'type'),
      tasks => sumBy(tasks, t => t.is_included_in_averages ? t[attr] : 0),
    );
  }

}

@identifiedBy('course/scores/heading')
class Heading extends BaseModel {
  @field({ type: 'bignum' }) average_score;
  @field({ type: 'bignum' }) average_progress;
  @field({ type: 'date' }) due_at;
  @field plan_id;
  @field title;
  @field type;
  @belongsTo({ model: 'course/scores/period' }) period;

  @computed get columnIndex() {
    return findIndex(this.period.data_headings, this);
  }

  @computed get isDue() {
    return moment(this.due_at).isBefore(TimeStore.getNow());
  }

  @computed get tasks() {
    return map(this.period.students, (s) => s.data[this.columnIndex]);
  }

  @computed get scoredStepCount() {
    return this._countsFor('step_count');
  }

  @computed get scoredExerciseCount() {
    return this._countsFor('exercise_count');
  }

  _countsFor(attr) {
    return reduce(this.tasks,
      (count, task) => task.is_included_in_averages ? count + task[attr] : count,
      0);
  }

}

@identifiedBy('course/scores/period')
export class CourseScoresPeriod extends BaseModel {

  @field({ type: 'bignum' }) overall_course_average;
  @field({ type: 'bignum' }) overall_reading_score;
  @field({ type: 'bignum' }) overall_reading_progress;
  @field({ type: 'bignum' }) overall_homework_score;
  @field({ type: 'bignum' }) overall_homework_progress;
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
    return this._countsFor('scoredStepCount');
  }

  @computed get scoredExerciseCount() {
    return this._countsFor('scoredExerciseCount');
  }

  _countsFor(attr) {
    const counts = {};
    each(this.students, (student) => {
      each(student[attr], (count, key) => {
        counts[key] = ((counts[key] || 0) + count);
      });
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
