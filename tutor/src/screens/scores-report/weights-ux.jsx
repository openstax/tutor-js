import { observable, computed, action } from 'mobx';
import { reduce } from 'lodash';

const CELL_AVERAGES_SINGLE_WIDTH = 80;

const DEFAULTS = {
  homework_scores: 100,
  homework_progress: 0,
  reading_scores: 0,
  reading_progress: 0,
};

export default class ScoresReportWeightsUX {

  @observable homework_scores;
  @observable homework_progress;
  @observable reading_scores;
  @observable reading_progress;

  @observable isSetting = false;

  constructor(scoresUx) {
    this.scoresUx = scoresUx;
  }

  @action.bound onSetClick() {
    const { course } = this.scoresUx;
    this.isSetting = true;
    this.homework_scores = course.homework_score_weight;
    this.homework_progress = course.homework_progress_weight;
    this.reading_scores = course.reading_score_weight;
    this.reading_progress = course.reading_progress_weight;
  }

  @action.bound onCancelClick() {
    this.isSetting = false;
  }

  @action.bound onSaveWeights() {

  }

  @action.bound setWeight(ev) {
    this[ev.target.name] = parseInt(ev.target.value);
  }

  @computed get isValid() {
    return 100 === reduce(DEFAULTS, (ttl, v, attr) => this[attr] + ttl, 0);
  }

  @action.bound setDefaults() {
    Object.assign(this, DEFAULTS);
  }

}
