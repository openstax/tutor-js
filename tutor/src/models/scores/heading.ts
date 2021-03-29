import { reduce, map, filter, isEmpty, findIndex } from 'lodash';
import Big from 'big.js';
import moment from 'moment';
import { BaseModel, field, model, modelize, computed, action } from 'shared/model';
import DateTime from 'shared/model/date-time';
import Time from '../time';

export default class Heading extends BaseModel {
    @field({ type: 'bignum' }) average_score;
    @field({ type: 'bignum' }) average_progress;
    @model(DateTime) due_at = DateTime.unknown;
    @field plan_id;
    @field title;
    @field type;
    @field available_points;
    @model('scores/period') period;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get columnIndex() {
        return findIndex(this.period.data_headings, this);
    }

    @computed get isExternal() {
        return this.type === 'external';
    }

    @computed get canReview() {
        return Boolean(
            this.type === 'reading' || this.type == 'homework'
        );
    }

    @computed get isDue() {
        return moment(this.due_at).isBefore(Time.now);
    }

    @computed get tasks() {
        return map(this.period.students, (s) => s.data[this.columnIndex]);
    }

    @action adjustScores() {
        this.average_score = this.averageForType('score');
        this.average_progress = this.averageForType('progress');
    }

    averageForType(attr) {
        const tasks = filter(this.tasks, 'student.isActive');
        if (isEmpty(tasks)) { return null; }

        return reduce(tasks,
            (acc, s) => acc.plus(s[attr] || 0),
            new Big(0)
        ).div(tasks.length);
    }
}
