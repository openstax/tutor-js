import { observable, computed, action } from 'mobx';
import { sum, toArray, flow, each, inRange, keys, isEqual, pick, some, invert, mapValues } from 'lodash';

const CELL_AVERAGES_SINGLE_WIDTH = 80;

const DEFAULTS = {
  homework_scores: 100,
  homework_progress: 0,
  reading_scores: 0,
  reading_progress: 0,
};

const RECOMMENDED = {
  homework_scores: 50,
  homework_progress: 0,
  reading_scores: 0,
  reading_progress: 50,
};

const CW = {
  homework_score_weight: 'homework_scores',
  homework_progress_weight: 'homework_progress',
  reading_score_weight: 'reading_scores',
  reading_progress_weight: 'reading_progress',
};

const WC = invert(CW);

const SETTINGS = keys(DEFAULTS);

const MIN = 0;
const MAX = 100;
const RANGE = MAX - MIN;

const weightToPercent = (weight) => ((weight || MIN) * RANGE );
const percentToWeight = (percent) => ((percent || MIN) / RANGE );

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

  @computed get course() {
    return this.scoresUx.course;
  }

  @computed get isBusy() {
    return this.course.api.isPending;
  }

  @action.bound onSetClick() {
    const { course } = this;
    this.isSetting = true;
    Object.assign(this, this.current);
  }

  @action.bound onCancelClick() {
    this.isSetting = false;
  }

  @action.bound onSaveWeights() {
    const { course } = this;
    Object.assign(course, this.next);
    course.save().then(() => {
      course.scores.fetch();
      this.isSetting = false;
    });
  }

  @action.bound setWeight(ev) {
    this.hasTouched = true;
    const weight = parseInt(ev.target.value);
    if (inRange(weight, MIN, MAX + 1)) { // inRange is up to but not including end
      this[ev.target.name] = weight;
    }
  }

  @computed get savedCourseWeightsAsPercents() {
    const { course } = this;
    return mapValues(WC, (c) => weightToPercent(course[c]));
  }

  @computed get uxPercentsAsCourseWeights() {
    return mapValues(CW, (w) => percentToWeight(this[w]));
  }

  @computed get current() {
    return this.savedCourseWeightsAsPercents;
  }

  @computed get next() {
    return this.uxPercentsAsCourseWeights;
  }

  @computed get values() {
    return pick(this, SETTINGS);
  }

  @computed get total() {
    return flow(
      toArray,
      sum,
      Math.round,
    )(this.values);
  }

  @computed get isValid() {
    return this.total === MAX;
  }

  matches(comparisonSettings) {
    return isEqual(this.values, comparisonSettings);
  }

  @computed get isRecommended() {
    return this.matches(RECOMMENDED);
  }

  @computed get isDefault() {
    return this.matches(DEFAULTS);
  }

  @computed get hasChanged() {
    return !this.matches(this.current);
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
