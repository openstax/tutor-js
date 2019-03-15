import { reduce, isEmpty, isNil } from 'lodash';
import { action, computed } from 'mobx';
import Big from 'big.js';
import {
  BaseModel, identifiedBy, identifier, field, hasMany, belongsTo,
} from 'shared/model';

import TaskResult from './task-result';

export default
@identifiedBy('scores/student')
class Student extends BaseModel {
  @hasMany({ model: TaskResult, inverseOf: 'student' }) data;
  @field first_name;
  @field last_name;
  @field is_dropped;
  @field name;
  @identifier role;
  @field student_identifier;
  @belongsTo({ model: 'scores/period' }) period;

  @field({ type: 'bignum' }) course_average;
  @field({ type: 'bignum' }) homework_score;
  @field({ type: 'bignum' }) homework_progress;
  @field({ type: 'bignum' }) reading_score;
  @field({ type: 'bignum' }) reading_progress;

  @computed get isActive() {
    return true !== this.is_dropped;
  }

  get course() {
    return this.period.course;
  }

  isValid(type) {
    return this.course[`${type}_score_weight`] && !this[`${type}_score`] &&
      this.course[`${type}_progress_weight`] && !this[`${type}_progress`];
  }

  @action adjustScores(triggeringTask) {
    this[`${triggeringTask.type}_progress`] = this.averageTasksOfType(
      triggeringTask.type, 'progress'
    );

    this[`${triggeringTask.type}_score`] = this.averageTasksOfType(
      triggeringTask.type, 'score'
    );

    const { course } = this;

    if (
      this.isValid('homework') && this.isValid('reading')
    ) {
      this.course_average =
        Big(course.homework_score_weight).times(this.homework_score)
          .plus(
            Big(course.homework_progress_weight).times(this.homework_progress)
          )
          .plus(
            Big(course.reading_score_weight).times(this.reading_score)
          )
          .plus(
            Big(course.reading_progress_weight).times(this.reading_progress)
          );
    }
  }

  averageTasksOfType(type, attr) {
    const tasks = this.data.filter(t => t.is_included_in_averages && t.type === type);
    if (isEmpty(tasks)) { return null; }

    return reduce(tasks,
      (acc, t) => acc.plus(t[attr] || 0),
      new Big(0)
    ).div(tasks.length);
  }

};
