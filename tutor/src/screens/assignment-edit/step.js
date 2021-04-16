import { React, PropTypes, observer, observable, computed, action, modelize } from 'vendor';
import details from './details';
import chapters from './chapters';
import questions from './questions';
import points from './points';
import reorder from './reorder';

import UnknownType from './unknown';

const reading = {
    details,
    chapters,
    reorder,
};

const homework = {
    details,
    chapters,
    questions,
    points,
};

const external = {
    details,
};

const event = {
    details,
};

const StepTypes = {
    homework, reading, external, event,
};


const Step = observer(({ ux }) => {
    const Component = ux.steps.currentStepComponent || UnknownType;
    return <Component ux={ux} />;
});

Step.propTypes = {
    ux: PropTypes.object.isRequired,
};

class StepUX {

    constructor(ux, stepIndex = 'details') {
        modelize(this)
        this.ux = ux;
        this.setIndex(stepIndex);
    }

    @observable _stepIndex;

    @computed get number() {
        return this._stepIndex + 1;
    }

    @computed get headerText() {
        return this.hasSteps ? `STEP ${this.number}` : null;
    }

    @computed get hasSteps() {
        return this.stepIds.length > 1;
    }

    @action.bound async goForward() {
        if (this.canGoForward) {
            // TODO, skip steps if the assignment type doesn't need the next,
            // for instance events won't have chapters & questiosn
            await this.ux.saveAsDraft();

            this.ux.navigateToStep(this.stepIds[this._stepIndex + 1]);
        }
    }

    @action setIndex(index) {
        const stepIndex = this.stepIds.indexOf(index);
        if (-1 !== stepIndex) {
            this._stepIndex = stepIndex;
        }
    }

    @action.bound goBackward() {
        if (this.canGoBackward) {
            this.ux.navigateToStep(this.stepIds[this._stepIndex - 1]);
        }
    }

    @computed get isLast() {
        return this._stepIndex >= this.stepIds.length - 1;
    }

    @computed get isFirst() {
        return this._stepIndex <= 0;
    }

    @computed get stepComponents() {
        return StepTypes[this.ux.plan.type];
    }

    @computed get stepIds() {
        return Object.keys(this.stepComponents || {});
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
        !this.isLast &&
        this.ux.validations.isValid
        );
    }

    @computed get canGoBackward() {
        return Boolean(
            !this.isApiPending && !this.isFirst
        );
    }

    @computed get canSubmit() {
        return Boolean(
            this.ux.validations.isValid
        );
    }

}


export { StepUX, Step, StepTypes };
