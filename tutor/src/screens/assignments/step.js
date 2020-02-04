import { React, PropTypes, observer, observable, computed, action } from 'vendor';
import details from './details';
import chapters from './chapters';
import questions from './questions';
import points from './points';
import UnknownType from './unknown';

const STEPS = {
  details,
  chapters,
  questions,
  points,
};

const STEP_IDS = Object.keys(STEPS);

const reading = {
  details,
  chapters,
};

const homework = {
  details,
  chapters,
  questions,
  points,
};

const StepTypes = {
  homework, reading,
};


const Step = observer(({ ux }) => {
  const Component = ux.steps.currentStepComponent || UnknownType;
  return <Component ux={ux} />;
});

Step.propTypes = {
  ux: PropTypes.object.isRequired,
};

class StepUX {

  constructor(ux) {
    this.ux = ux;
  }

  @observable _stepIndex = 0;

  @computed get number() {
    return this._stepIndex + 1;
  }

  @action.bound goToStep(index) {
    this._stepIndex = index;
  }

  @action.bound goForward() {
    if (this.canGoForward) {
      // TODO, skip steps if the assignment type doesn't need the next,
      // for instance events won't have chapters & questiosn
      this.goToStep(this._stepIndex + 1);
    }
  }

  @action.bound goBackward() {
    if (this.canGoBackward) {
      this.goToStep(this._stepIndex - 1);
    }
  }

  @computed get stepComponents() {
    return StepTypes[this.ux.plan.type];
  }

  @computed get stepIds() {
    return Object.keys(this.stepComponents);
  }

  @computed get currentStepComponent() {
    return this.stepComponents[this.currentStepId];
  }

  @computed get currentStepId() {
    return this.stepIds[this._stepIndex];
  }

  @computed get canGoForward() {
    return Boolean(
      !this.isApiPending &&
        this._stepIndex < this.stepIds.length - 1 &&
        this.ux.validations.isValid
    );
  }

  @computed get canGoBackward() {
    return Boolean(
      !this.isApiPending && this._stepIndex > 0
    );
  }

}


export { StepUX, Step, StepTypes }; // STEP_IDS };
