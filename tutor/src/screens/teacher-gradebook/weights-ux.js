import { observable, computed, action } from 'mobx';

const DEFAULTS = {
  ux_reading_weight: 50,
  ux_homework_weight: 50,
};

const MAX = 100;

export default class ScoresReportWeightsUX {

  @observable ux_homework_weight;
  @observable ux_reading_weight;

  @observable isSaving = false;
  @observable showWeightsModal = false;

  constructor(scoresUx) {
    this.scoresUx = scoresUx;
    // weights in the BE (course) are between 0 and 1
    this.ux_homework_weight = this.course.homework_weight * 100;
    this.ux_reading_weight = this.course.reading_weight * 100;
  }

  @computed get course() {
    return this.scoresUx.course;
  }

  @computed get isBusy() {
    return Boolean(this.course.api.isPending || this.course.scores.api.isPending || this.isSaving);
  }

  @action.bound async onSaveWeights() {
    this.isSaving = true;
    const { course } = this;
    Object.assign(course, {
      homework_weight: this.ux_homework_weight / 100,
      reading_weight: this.ux_reading_weight / 100,
    });
    try {
      await course.save();
      await course.scores.fetch();
    } catch {
      // reset course weights to previous weight values
      Object.assign(course, {
        homework_weight: this.ux_homework_weight * 100,
        reading_weight: this.ux_reading_weight * 100,
      });
    }
    finally {
      this.isSaving = false;
      this.hideWeights();
    }
  }

  @action.bound setWeight(weight, targetName) {
    this[targetName] = weight;
  }

  @computed get total() {
    return this.ux_reading_weight + this.ux_homework_weight;
  }

  @computed get isValid() {
    return this.total === MAX;
  }

  @computed get hasChanged() {
    return this.ux_homework_weight / 100 !== this.course.homework_weight
          || this.ux_reading_weight / 100 !== this.course.reading_weight;
  }

  @computed get isSaveable() {
    return this.isValid && !this.isBusy && this.hasChanged;
  }

  getDefaults() {
    return DEFAULTS;
  }

  /**
   * Show Weights modal
   */
  @action showWeights() {
    this.showWeightsModal = true;
  }

  /**
   * Hide Weights modal
   */
  @action hideWeights() {
    this.showWeightsModal = false;
  }
}