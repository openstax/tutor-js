import { reduce, isEmpty } from 'lodash';
import { action, computed } from 'mobx';
import Big from 'big.js';
import {
  BaseModel, identifiedBy, identifier, field, hasMany, belongsTo,
} from 'shared/model';

import TaskResult from './task-result';

export default
@identifiedBy('course/scores/student')
class Student extends BaseModel {
  @hasMany({ model: TaskResult, inverseOf: 'student' }) data;
  @field first_name;
  @field last_name;
  @field is_dropped;
  @field name;
  @identifier role;
  @field student_identifier;
  @belongsTo({ model: 'course/scores/period' }) period;

  @field({ type: 'bignum' }) course_average;
  @field({ type: 'bignum' }) homework_score;
  @field({ type: 'bignum' }) homework_progress;
  @field({ type: 'bignum' }) reading_score;
  @field({ type: 'bignum' }) reading_progress;

  @computed get isActive() {
    return true !== this.is_dropped;
  }

  @action adjustScores(triggeringTask) {
    this[`${triggeringTask.type}_progress`] = this.averageTasksOfType(
      triggeringTask.type, 'progress'
    );

    this[`${triggeringTask.type}_score`] = this.averageTasksOfType(
      triggeringTask.type, 'score'
    );

    const { course } = this.period;

    if (
      !((course.homework_score_weight && !this.homework_score) ||
        (course.homework_progress_weight && !this.homework_progress) ||
        (course.reading_score_weight && !this.reading_score) ||
        (course.reading_progress_weight && !this.reading_progress)
      )
    ) {
      this.course_average =
        Big(course.homework_score_weight).times(this.homework_score || 0)
          .plus(
            Big(course.homework_progress_weight).times(this.homework_progress || 0)
          )
          .plus(
            Big(course.reading_score_weight).times(this.reading_score || 0)
          )
          .plus(
            Big(course.reading_progress_weight).times(this.reading_progress || 0)
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
