import { find, reduce, isEmpty, filter } from 'lodash';
import { computed, action } from 'mobx';
import Big from 'big.js';
import { BaseModel, field, hasMany, modelize } from 'shared/model';
import Heading from './heading';
import Student from './student';

export default class CourseScoresPeriod extends BaseModel {

  @field({ type: 'bignum' }) overall_course_average;
  @field({ type: 'bignum' }) overall_reading_score;
  @field({ type: 'bignum' }) overall_reading_progress;
  @field({ type: 'bignum' }) overall_homework_score;
  @field({ type: 'bignum' }) overall_homework_progress;
  @field period_id;
  @hasMany({ model: Heading, inverseOf: 'period' }) data_headings;
  @hasMany({ model: Student, inverseOf: 'period', extend: {
      active() { return filter(this, 'isActive'); },
  } }) students;

  constructor(attrs, course) {
      super(attrs);
      modelize(this);
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

      if (
          !((course.homework_score_weight && !this.overall_homework_score) ||
        (course.homework_progress_weight && !this.overall_homework_progress) ||
        (course.reading_score_weight && !this.overall_reading_score) ||
        (course.reading_progress_weight && !this.overall_reading_progress)
          )
      ) {
          this.overall_course_average =
        Big(course.homework_score_weight).times(this.overall_homework_score || 0)
            .plus(
                Big(course.homework_progress_weight).times(this.overall_homework_progress || 0)
            )
            .plus(
                Big(course.reading_score_weight).times(this.overall_reading_score || 0)
            )
            .plus(
                Big(course.reading_progress_weight).times(this.overall_reading_progress || 0)
            );
      }
  }

  averageForType(attr) {
      const students = this.students.active();
      if (isEmpty(students)) { return null; }

      return reduce(students,
          (acc, s) => acc.plus(s[attr] || 0),
          new Big(0)
      ).div(students.length);
  }

}
