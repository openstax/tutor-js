import { observable, computed, action } from 'mobx';
import { reduce, each, inRange, keys, isEqual, pick, some, invert, mapValues } from 'lodash';

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

const WC = invert(CW);

const SETTINGS = keys(DEFAULTS);

export default class ScoresReportWeightsUX {

  @observable homework_scores;
  @observable homework_progress;
  @observable reading_scores;
  @observable reading_progress;

  @observable hasTouched = false;
  @observable isSetting = false;

  constructor(scoresUx) {
    this.scoresUx = scoresUx;
  }

  @action.bound onSetClick() {
    const { course } = this;
    this.isSetting = true;
    Object.assign(this, this.savedCourseWeightsAsPercents);
  }

  @action.bound onCancelClick() {
    this.isSetting = false;
  }

  @action.bound onSaveWeights() {
    const { course } = this;
    Object.assign(course, this.uxPercentsAsCourseWeights);
    course.save().then(() => {
      course.scores.fetch();
      this.isSetting = false;
    });
  }

  @computed get course() {
    return this.scoresUx.course;
  }

  @computed get savedCourseWeightsAsPercents() {
    const { course } = this;
    return mapValues(WC, (c, w) => ((course[c] || 0) * 100));
  }

  @computed get uxPercentsAsCourseWeights() {
    return mapValues(CW, (w, c) => (this[w] / 100));
  }

  @computed get isBusy() {
    return this.course.api.isPending;
  }

  @action.bound setWeight(ev) {
    this.hasTouched = true;
    const weight = parseInt(ev.target.value);
    if (inRange(weight, 0, 101)) { // inRange is up to but not including end
      this[ev.target.name] = weight;
    }
  }

  @computed get isValid() {
    return 100 === Math.round(
      reduce(DEFAULTS, (ttl, v, attr) => this[attr] + ttl, 0)
    );
  }

  @computed get isDefault() {
    return isEqual(pick(this, SETTINGS), DEFAULTS);
  }

  @computed get hasChanged() {
    return !isEqual(pick(this, SETTINGS), this.savedCourseWeightsAsPercents);
  }

  @computed get isRestorable() {
    return this.hasChanged;
  }

  @computed get isSaveable() {
    return this.hasChanged && this.isValid && !this.isBusy;
  }

  @computed get showIsInvalid() {
    return this.hasTouched && !this.isValid;
  }

  @computed get showIsValid() {
    return this.hasTouched && this.isValid;
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
