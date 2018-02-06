import { observable, computed, action } from 'mobx';
import { reduce, each } from 'lodash';

const CELL_AVERAGES_SINGLE_WIDTH = 80;

const DEFAULTS = {
  homework_scores: 100,
  homework_progress: 0,
  reading_scores: 0,
  reading_progress: 0,
};

const CW = {
  homework_score_weight: 'homework_scores',
  homework_progress_weight: 'homework_progress',
  reading_score_weight: 'reading_scores',
  reading_progress_weight: 'reading_progress',
};

export default class ScoresReportWeightsUX {

  @observable homework_scores;
  @observable homework_progress;
  @observable reading_scores;
  @observable reading_progress;

  @observable hasChanged = false;
  @observable isSetting = false;
  @observable errorMessage = '';

  constructor(scoresUx) {
    this.scoresUx = scoresUx;
  }

  @action.bound onSetClick() {
    const { course } = this;
    this.isSetting = true;
    each(CW, (w, c) => {
      this[w] = (course[c] || 0) * 100;
    });
  }

  @action.bound onCancelClick() {
    this.isSetting = false;
  }

  @action.bound onSaveWeights() {
    const { course } = this;
    each(CW, (w, c) => {
      course[c] = this[w] / 100;
    });
    course.save().then(() => {
      course.scores.fetch();
      this.errorMessage = '';
      this.isSetting = false;
    });
  }

  @computed get course() {
    return this.scoresUx.course;
  }

  @computed get isBusy() {
    return this.course.api.isPending;
  }

  @action.bound setWeight(ev) {
    this.hasChanged = true;
    this[ev.target.name] = parseInt(ev.target.value);
  }

  @computed get isValid() {
    return 100 === Math.round(
      reduce(DEFAULTS, (ttl, v, attr) => this[attr] + ttl, 0)
    );
  }

  @computed get isRestorable() {
    return this.hasChanged;
  }

  @computed get isSaveable() {
    return this.hasChanged && this.isValid && !this.isBusy;
  }

  @computed get showIsInvalid() {
    return this.hasChanged && !this.isValid;
  }

  @computed get showIsValid() {
    return this.hasChanged && this.isValid;
  }

  @computed get msgIconType() {
    return (this.showIsValid && 'check-circle') || 'info-circle';
  }

  @computed get msg() {
    return (this.showIsValid && ' Weights total 100%') || ' Weights must total 100%';
  }

  @action.bound setDefaults() {
    Object.assign(this, DEFAULTS);
  }

}
