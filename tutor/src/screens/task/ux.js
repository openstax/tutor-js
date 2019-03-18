import { observable, computed, action, observe, when } from 'mobx';
import { get } from 'lodash';

export default class TaskUX {

  // privateish
  @observable _stepIndex = 0;

  constructor({ task }) {
    this.task = task;
    this.task.fetch();
    when(
      () => !this.task.api.isPendingInitialFetch,
      () => this.goToStep(0)
    );
  }

  @action.bound setFreeResponse() {

  }

  @computed get steps() {
    return this.task.steps;
  }

  @computed get controlButtons() {
    return [];
  }

  @computed get canReviewCurrentStep() {

  }

  @action.bound onStepCompleted(step) {

  }

  @action.bound setAnswerId() {

  }

  @action.bound canContinueStep(id) {

  }

  @action.bound goBackward() {
    this.goToStep(this._stepIndex - 1);
  }

  @action.bound goForward() {
    this.goToStep(this._stepIndex + 1);
  }

  @computed get hasProgress() {
    return Boolean(
      'reading' === this.task.type && this.task.steps.length
    );
  }

  @computed get course() {
    return this.task.tasksMap.course;
  }

  @computed get courseAppearanceDataProps() {
    return {
      'data-title': this.course.name,
      'data-book-title': this.course.bookName || '',
      'data-appearance': this.course.appearance_code,
    };

  }

  @action goToStep(index) {
    this._stepIndex = index;
    if (this.currentStep.needsFetched) {
      this.currentStep.fetch();
    }
  }

  @computed get canGoForward() {
    return this._stepIndex < this.task.steps.length - 1;
  }

  @computed get canGoBackward() {
    return this._stepIndex > 0;
  }

  @computed get currentStepIndex() {
    return this._stepIndex;
  }

  @computed get currentStep() {
    return this.steps[this._stepIndex];
  }

  @computed get previousStep() {
    return this.canGoBackward ?
      this.steps[this._stepIndex - 1] : null;
  }

  @computed get nextStep() {
    return this.canGoForward ?
      this.steps[this._stepIndex + 1] : null;
  }

  @computed get relatedStepTitles() {
    return {
      previous: get(this.previousStep, 'preview'),
      current: this.currentStep.preview,
      next: get(this.nextStep, 'preview'),
    };
  }

}
