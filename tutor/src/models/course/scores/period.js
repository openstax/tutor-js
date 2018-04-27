import { find, reduce } from 'lodash';
import { computed, action } from 'mobx';
import Big from 'big.js';
import {
  BaseModel, identifiedBy, field, hasMany,
} from 'shared/model';
import Heading from './heading';
import Student from './student';

@identifiedBy('course/scores/period')
export default class CourseScoresPeriod extends BaseModel {

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

  @action adjustScores(triggeringTask) {
    this[`overall_${triggeringTask.type}_progress`] = this.averageForType(
      `${triggeringTask.type}_progress`,
    );
    this[`overall_${triggeringTask.type}_score`] = this.averageForType(
      `${triggeringTask.type}_score`,
    );

    const { course } = this;

    this.overall_course_average = this.overall_homework_score
      .times(course.homework_score_weight / 100)
      .plus(this.overall_homework_progress.times(course.homework_progress_weight / 100))
      .plus(this.overall_reading_score.times(course.reading_score_weight / 100))
      .plus(this.overall_reading_progress.times(course.reading_progress_weight / 100));

  }

  averageForType(attr) {
    return reduce(this.students,
      (acc, s) => acc.plus(s[attr] || 0),
      new Big(0)
    ).div(this.students.length);
  }

}
