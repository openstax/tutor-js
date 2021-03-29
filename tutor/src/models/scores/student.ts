import { reduce, isEmpty, isNil } from 'lodash';
import Big from 'big.js';
import { BaseModel, field, model, modelize, action, computed, NEW_ID } from 'shared/model';

import TaskResult from './task-result';

export default class Student extends BaseModel {
    @model(TaskResult) data = [];
    @field first_name;
    @field last_name;
    @field is_dropped;
    @field name;
    @field role = NEW_ID;
    @field student_identifier;
    @model('scores/period') period;

    @field({ type: 'bignum' }) course_average;
    @field({ type: 'bignum' }) homework_score;
    @field({ type: 'bignum' }) homework_progress;
    @field({ type: 'bignum' }) reading_score;
    @field({ type: 'bignum' }) reading_progress;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get isActive() {
        return true !== this.is_dropped;
    }

    get course() {
        return this.period.course;
    }

    isValid(type) {
        // if the course has a weight set then there must be a score as well
        if (this.course[`${type}_score_weight`] && isNil(this[`${type}_score`])) {
            return false;
        }
        if (this.course[`${type}_progress_weight`] && isNil(this[`${type}_progress`])) {
            return false;
        }
        return true;
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
}
