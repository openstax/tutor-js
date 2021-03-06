import { BaseModel, computed, action, observable, modelize, runInAction } from 'shared/model';
import { find, filter, each } from 'lodash';
import type { Tour, TourContext, TourRegion, TourStep } from '../../models'

export class TourRide extends BaseModel {

    @observable tour: Tour
    @observable context: TourContext
    @observable region?: TourRegion

    @observable _stepIndex = 0;
    @observable _isReady = false;
    @observable joyrideRef: any;
    @observable windowStub: any

    constructor({ tour, context, region }: { tour: Tour, context: TourContext, region: TourRegion }) {
        super();
        modelize(this);
        this.tour = tour
        this.context = context
        this.region = region
        each(this.tour.steps, s => s.preValidate());
        if (this.currentStep) {
            this.currentStep.prepare({ prevStep: null }).then(() => {
                runInAction(() => this._isReady = true);
            });
        } else {
            runInAction(() => this._isReady = true);
        }
    }

    @computed get isReady() {
        return Boolean(this._isReady && this.currentStep);
    }

    @action.bound onCancel() {
        this.currentStep?.complete({ prevStep: this.prevStep });
        this.markComplete(true);
    }

    @action markComplete(exitedEarly = false) {
        this._stepIndex = this.validSteps.length;
        this.context.onTourComplete({ exitedEarly });
    }

    @computed get props(): { ride: TourRide, step: TourStep | null } {
        return {
            ride: this,
            step: this.currentStep,
        };
    }

    @computed get currentStep(): TourStep | null {
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
        await this.currentStep?.complete({ nextStep: prevStep });
        if (!prevStep) {
            return Promise.resolve();
        }
        await prevStep.prepare({ prevStep: this.currentStep });
        runInAction(() => this._stepIndex -= 1);
        return Promise.resolve();
    }

    @action.bound async onNextStep() {
        const { nextStep } = this;
        await this.currentStep?.complete({ nextStep });
        if (!nextStep) {
            this.markComplete();
            return Promise.resolve();
        }
        await nextStep.prepare({ prevStep: this.currentStep });
        runInAction(() => this._stepIndex += 1);
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
