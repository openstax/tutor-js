import {
  BaseModel, identifiedBy, computed, session,
} from 'shared/model';
import { action, observable } from 'mobx';
import { find, filter, each } from 'lodash';

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
    each(this.tour.steps, s => s.preValidate());
    if (this.currentStep) {
      this.currentStep.prepare({ prevStep: null }).then(() => {
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
    this.currentStep.complete({ prevStep: this.prevStep });
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

  @computed get prevStep() {
    return this.canGoBackward ?
      this.validSteps[this._stepIndex - 1] : null;
  }

  @computed get nextStep() {
    return this.canGoForward ?
      this.validSteps[this._stepIndex + 1] : null;
  }

  @action.bound async onPrevStep() {
    const { prevStep } = this;
    await this.currentStep.complete({ nextStep: prevStep });
    if (!prevStep) {
      return Promise.resolve();
    }
    await prevStep.prepare({ prevStep: this.currentStep });
    this._stepIndex -= 1;
    return Promise.resolve();
  }

  @action.bound async onNextStep() {
    const { nextStep } = this;
    await this.currentStep.complete({ nextStep });
    if (!nextStep) {
      this.context.onTourComplete();
      return Promise.resolve();
    }
    await nextStep.prepare({ prevStep: this.currentStep });
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
    if (!this.canGoForward || !this.hasMultipleSteps) { // last step
      return 'Close';
    }
    return `Next ${this._stepIndex + 1}/${this.validSteps.length}`;
  }

  @computed get hasMultipleSteps() {
    return this.validSteps.length > 1;
  }

  get window() {
    return this.windowStub || window;
  }

}
