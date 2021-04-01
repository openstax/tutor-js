import { reduce, map, filter, isEmpty, findIndex } from 'lodash';
import Big from 'big.js';
import { BaseModel, field, model, modelize, computed, NEW_ID, getParentOf } from 'shared/model';
import DateTime from 'shared/model/date-time';
import Bignum from 'shared/model/bignum'
import type PeriodScores from './period'

export default class Heading extends BaseModel {
    @model(Bignum) average_score = Bignum.unknown;
    @model(Bignum) average_progress = Bignum.unknown;
    @model(DateTime) due_at = DateTime.unknown;
    @field plan_id = NEW_ID;
    @field title = '';
    @field type = '';
    @field available_points = 0;

    get period():PeriodScores { return getParentOf(this) }

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get columnIndex(): number {
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
        return this.due_at.isInPast
    }

    @computed get tasks() {
        return map(this.period.students, (s) => s.data[this.columnIndex]);
    }

    averageForType(attr: string) {
        const tasks = filter(this.tasks, 'student.isActive');
        if (isEmpty(tasks)) { return null; }

        return reduce(tasks,
            (acc, s) => acc.plus(s[attr] || 0),
            new Big(0)
        ).div(tasks.length);
    }
}
