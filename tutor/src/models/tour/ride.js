import {
  BaseModel, identifiedBy, computed, session,
} from 'shared/model';
import { action, observable } from 'mobx';
import { find, filter } from 'lodash';

export default
@identifiedBy('tour/ride')
class TourRide extends BaseModel {

  @session({ type: 'object' }) tour;
  @session({ type: 'object' }) context;
  @session({ type: 'object' }) region;

  @observable _stepIndex = 0;
  @observable _isReady = false;
  @observable joyrideRef;

  constructor(attrs) {
    super(attrs);
    if (this.currentStep) {
      this.currentStep.prepare().then(() => {
        this._isReady = true;
      });
    } else {
      this._isReady = true;
    }
  }

  @computed get isReady() {
    return Boolean(this._isReady && this.currentStep);
  }

  @action.bound onCancel() {
    this._stepIndex = this.validSteps.length;
    this.markComplete(true);
  }

  @action markComplete(exitedEarly = false) {
    this.context.onTourComplete({ exitedEarly });
  }

  @computed get props() {
    return {
      ride: this,
      step: this.currentStep,
    };
  }

  @computed get currentStep() {
    return (this.validSteps.length && this.validSteps[this._stepIndex]) || null;
  }

  @computed get canGoBackward() {
    return this._stepIndex > 0;
  }

  @computed get canGoForward() {
    return (this._stepIndex < this.validSteps.length - 1);
  }

  @computed get nextStep() {
    return this.canGoForward ?
      this.validSteps[this._stepIndex + 1] : null;
  }

  @action.bound async onPrevStep() {
    if (this.canGoBackward) {
      this._stepIndex -= 1;
    }
  }

  @action.bound async onNextStep() {
    const { nextStep } = this;
    await this.currentStep.complete();
    if (!nextStep) {
      this.context.onTourComplete();
      return Promise.resolve();
    }
    await nextStep.prepare();
    this._stepIndex += 1;
    return Promise.resolve();
  }

  @computed get validSteps() {
    return filter(this.tour.steps, 'isViewable');
  }

  @computed get hasValidSteps() {
    return !!find(this.tour.steps, 'isViewable');
  }

  @computed get nextLabel() {
    if (!this.canGoForward || !this.showStepsProgress) { // last step
      return 'Close';
    }
    return `Next ${this._stepIndex + 1}/${this.validSteps.length}`;
  }

  @computed get showStepsProgress() {
    return this.validSteps.length > 1;
  }

  get window() {
    return this.windowStub || window;
  }

}
