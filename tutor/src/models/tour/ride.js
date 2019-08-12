import {
  BaseModel, identifiedBy, computed, session,
} from 'shared/model';
import { defaults, compact } from 'lodash';
import { action, observable } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { filter, extend, isEmpty } from 'lodash';
import CustomComponents from '../../components/tours/custom';

const DEFAULT_JOYRIDE_CONFIG = {
  run: true,
  type: 'continuous',
  autoStart: true,
  scrollToSteps: true,
  scrollToFirstStep: true,
  scrollOffset: 120, // below top navbar
  disableOverlay: true, // poorly named: still shows overlay, but disables canceling tours when it's clicked
  resizeDebounce: true,
  resizeDebounceDelay: 200,
  holePadding: 5,
};

export default
@identifiedBy('tour/ride')
class TourRide extends BaseModel {

  @session({ type: 'object' }) tour;
  @session({ type: 'object' }) context;
  @session({ type: 'object' }) region;

  @observable currentStep = 0;
  @observable joyrideRef;

  @computed get joyrideProps() {
    const { tour } = this;
    if (!tour) { return {}; }
    return defaults({
      callback: this.joyrideCallback,
      debug: this.context.emitDebugInfo,
      tourId: tour.id,
      ref: ref => {
        if (ref) { this.joyrideRef = ref; }
      },
      locale: this.labels,
      showStepsProgress: this.showStepsProgress,
      scrollToSteps: tour.scrollToSteps,
      showOverlay: tour.showOverlay,
      steps: this.stepsToPlay,
      className: tour.className,
    }, DEFAULT_JOYRIDE_CONFIG);
  }

  // stepForRide checks if the steps are valid and returns null for the invalid ones
  @computed get tourSteps() {
    return compact(this.tour.steps.map(step => this.stepForRide(step)));
  }

  @computed get validSteps() {
    return filter(this.tourSteps, step => !!step);
  }

  @computed get replaySteps() {
    return filter(
      this.tourSteps, (step, stepIndex) => !!(this.tour.steps[stepIndex].shouldReplay)
    );
  }

  @computed get hasValidSteps() {
    return !isEmpty(this.validSteps);
  }

  @computed get stepsToPlay() {
    return this.hasValidSteps? this.validSteps : this.replaySteps;
  }

  @computed get labels() {
    return {
      back: 'Back',
      close: 'Close',
      last: 'Got It',
      next: 'Next',
      skip: 'Skip',
    };
  }

  @computed get showStepsProgress() {
    return this.stepsToPlay.length > 1;
  }

  @action.bound
  joyrideCallback({ index, type, action, step: joyRideStep }) {
    if (type === 'finished' || (action === 'close' && type === 'beacon:before')) {
      this.tour.markViewed({ exitedEarly: type !== 'finished' });
    }
    if (type === 'step:before'){ this.currentStep = index; }
    if (!joyRideStep){ return; } // is of a type we don't care about

    const { step } = joyRideStep;
    if (type === 'step:before' && step.actionClass) {
      joyRideStep.action = new step.actionClass(extend({
        step, ride: this, selector: joyRideStep.selector,
      }, step.action));
      joyRideStep.action.beforeStep();
    } else if (type === 'step:after' && joyRideStep.action) {
      joyRideStep.action.afterStep();
    }
  }

  get window() {
    return this.windowStub || window;
  }

  stepForRide = createTransformer(step => {
    if (step.anchor_id && !this.context.anchors.has(step.anchor_id)) {
      return null;
    }
    const props = step.joyrideStepProperties;

    if (step.customComponent && CustomComponents[step.customComponent]) {
      props.StepComponent = CustomComponents[step.customComponent];
      props.joyrideRef = this.joyrideRef;
      props.region = this.region;
    }

    return extend(props, {
      step,
      selector: (step.anchor_id ? this.context.anchors.get(step.anchor_id) : this.region.domSelector),
    });
  });

  dispose() {
    if (this.joyrideRef) {
      this.joyrideRef.reset(true);
    }
  }

}
