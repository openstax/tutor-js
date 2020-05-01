import { observable, computed, action } from 'mobx';
import { sum, toArray, flow, inRange, keys, isEqual, pick, invert, mapValues, partial } from 'lodash';
import { stringToInt } from '../../helpers/string';

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

const PERCENT_KEYS = keys(DEFAULTS);
const WEIGHT_KEYS = keys(CW);

const MIN = 0;
const MAX = 100;
const RANGE = MAX - MIN;

const weightToPercent = (weight) => ((weight || MIN) * RANGE );
const percentToWeight = (percent) => ((percent || MIN) / RANGE );

const weightsToPercents = (weights) => mapValues(WC, (c) => weightToPercent(weights[c]));
const percentsToWeights = (percents) => mapValues(CW, (w) => percentToWeight(percents[w]));

export default class ScoresReportWeightsUX {

  PERCENT_KEYS = PERCENT_KEYS;
  WEIGHT_KEYS = WEIGHT_KEYS;

  @observable homework_scores;
  @observable homework_progress;
  @observable reading_scores;
  @observable reading_progress;

  @observable hasTouched = false;
  @observable showWeightsModal = false;

  constructor(scoresUx) {
    this.scoresUx = scoresUx;
  }

  @computed get course() {
    return this.scoresUx.course;
  }

  @computed get isBusy() {
    return Boolean(this.course.api.isPending || this.course.scores.api.isPending);
  }

  @computed get savingButtonText() {
    if (this.course.scores.api.isPending) {
      return 'Recalculating scores…';
    } else {
      return 'Saving…';
    }
  }

  /**
   * Show Weights modal
   */
  @action showWeights() {
    this.showWeightsModal = true;
    Object.assign(this, this.currentPercents);
  }

  /**
   * Hide Weights modal
   */
  @action hideWeights() {
    this.showWeightsModal = false;
  }

  @action.bound async onSaveWeights() {
    const { course, currentPercents } = this;
    Object.assign(course, this.nextWeights);
    try {
      await course.save();
      await course.scores.fetch();
    } catch {
      // reset course weights to previous weight values
      Object.assign(course, percentsToWeights(currentPercents));
    }
    finally {
      this.isSetting = false;
    }
  }

  @action.bound setWeight(ev) {
    this.hasTouched = true;
    const weight = (ev.target.value !=='' && parseInt(ev.target.value)) || ev.target.value;
    if (inRange(weight, MIN, MAX + 1) || weight === '') { // inRange is up to but not including end
      this[ev.target.name] = weight;
    }
  }

  @computed get savedCourseWeightsAsPercents() {
    const { course } = this;
    return weightsToPercents(course);
  }

  @computed get uxPercentsAsCourseWeights() {
    return percentsToWeights(this);
  }

  @computed get currentPercents() {
    return this.savedCourseWeightsAsPercents;
  }

  @computed get nextWeights() {
    return this.uxPercentsAsCourseWeights;
  }

  @computed get weightValues() {
    return flow(
      partial(pick, partial.placeholder, this.PERCENT_KEYS),
      partial(mapValues, partial.placeholder, stringToInt),
    )(this);
  }

  @computed get total() {
    return flow(
      toArray,
      sum,
      Math.round,
    )(this.weightValues);
  }

  @computed get isValid() {
    return this.total === MAX;
  }

  matches(comparisonSettings) {
    return isEqual(this.weightValues, comparisonSettings);
  }

  @computed get isRecommended() {
    return this.matches(RECOMMENDED);
  }

  @computed get isDefault() {
    return this.matches(DEFAULTS);
  }

  @computed get hasChanged() {
    return !this.matches(this.currentPercents);
  }

  @computed get isSaveable() {
    return this.isValid && !this.isBusy;
  }

  @computed get showIsInvalid() {
    return !this.isValid;
  }

  @computed get showIsValid() {
    return this.isValid;
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

  @action.bound resetToCurrent() {
    Object.assign(this, this.currentPercents);
  }

}
