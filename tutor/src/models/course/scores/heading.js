import { reduce, map, isEmpty, findIndex } from 'lodash';
import { computed, action } from 'mobx';
import Big from 'big.js';
import moment from 'moment';
import {
  BaseModel, identifiedBy, field, belongsTo,
} from 'shared/model';
import { TimeStore } from '../../../flux/time';

@identifiedBy('course/scores/heading')
export default class Heading extends BaseModel {
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

  @action adjustScores() {
    this.average_score = this.averageForType('score');
    this.average_progress = this.averageForType('progress');
  }

  averageForType(attr) {
    if (isEmpty(this.tasks)) { return null; }
    return reduce(this.tasks,
      (acc, s) => acc.plus(s[attr] || 0),
      new Big(0)
    ).div(this.tasks.length);
  }

}
