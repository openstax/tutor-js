import { observable, computed, action } from 'mobx';
import { reduce } from 'lodash';

const CELL_AVERAGES_SINGLE_WIDTH = 80;

const WEIGHT_KEYS = [
  'homework_scores',
  'homework_progress',
  'reading_scores',
  'reading_progress',
];

export default class ScoresReportWeightsUX {

  @observable homework_scores = 10;
  @observable homework_progress = 10;
  @observable reading_scores = 40;
  @observable reading_progress = 40;

  @observable isSetting = false;

  @action.bound onSetClick() {
    this.isSetting = true;
  }

  @action.bound onCancelClick() {
    this.isSetting = false;
  }

  @action.bound setWeight(ev) {
    this[ev.target.name] = parseInt(ev.target.value);
  }

  @computed get isValid() {
    return 100 === reduce(WEIGHT_KEYS, (ttl, w) => this[w] + ttl, 0);
  }
}
