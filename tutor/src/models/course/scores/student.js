import { reduce, isEmpty } from 'lodash';
import { action } from 'mobx';
import Big from 'big.js';
import {
  BaseModel, identifiedBy, field, hasMany, belongsTo,
} from 'shared/model';

import TaskResult from './task-result';

@identifiedBy('course/scores/student')
export default class Student extends BaseModel {
  @hasMany({ model: TaskResult, inverseOf: 'student' }) data;
  @field first_name;
  @field last_name;
  @field is_dropped;
  @field name;
  @field role;
  @field student_identifier;
  @belongsTo({ model: 'course/scores/period' }) period;

  @field({ type: 'bignum' }) course_average;
  @field({ type: 'bignum' }) homework_score;
  @field({ type: 'bignum' }) homework_progress;
  @field({ type: 'bignum' }) reading_score;
  @field({ type: 'bignum' }) reading_progress;

  @action adjustScores(triggeringTask) {
    this[`${triggeringTask.type}_progress`] = this.averageTasksOfType(
      triggeringTask.type, 'progress'
    );

    this[`${triggeringTask.type}_score`] = this.averageTasksOfType(
      triggeringTask.type, 'score'
    );

    const { course } = this.period;

    this.course_average = this.homework_score
      .times(course.homework_score_weight / 100)
      .plus(this.homework_progress.times(course.homework_progress_weight / 100))
      .plus(this.reading_score.times(course.reading_score_weight / 100))
      .plus(this.reading_progress.times(course.reading_progress_weight / 100));
  }

  averageTasksOfType(type, attr) {
    const tasks = this.data.filter(t => t.is_included_in_averages && t.type === type);
    if (isEmpty(tasks)) { return Big(0); }

    return reduce(tasks,
        (acc, t) => acc.plus(t[attr] || 0),
        new Big(0)
    ).div(tasks.length);
  }

}
