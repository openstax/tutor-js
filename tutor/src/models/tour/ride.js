import React from 'react';
import {
  BaseModel, identifiedBy, belongsTo, computed,
} from '../base';
import { defaults } from 'lodash';
import { action, observable } from 'mobx';
import { filter, extend } from 'lodash';
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
};

@identifiedBy('tour/ride')
export default class TourRide extends BaseModel {

  @belongsTo({ model: 'tour' }) tour;
  @belongsTo({ model: 'tour/context' }) context;
  @belongsTo({ model: 'tour/region' }) region;

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
      steps: this.validSteps,
    }, DEFAULT_JOYRIDE_CONFIG);
  }

  @computed get tourSteps() {
    return this.tour.steps.map(step => this.stepForRide(step));
  }

  @computed get validSteps() {
    return filter(
      this.tourSteps, step => !!(step && (!step.anchor_id ||this.context.anchors.has(step.anchor_id)))
    );
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
    return this.validSteps.length > 1;
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

  stepForRide(step) {
    if (step.anchor_id && !this.context.anchors.has(step.anchor_id)) {
      return null;
    }
    const props = step.joyrideStepProperties;

    if (!step.text && step.component && CustomComponents[step.component]){
      props.text = React.createElement(CustomComponents[step.component], { step, ride: this });
      props.style = extend(props.style, {
        button: {
          display: 'none',
        },
      });
    }

    return extend(props, {
      step,
      selector: (step.anchor_id ? this.context.anchors.get(step.anchor_id) : this.region.domSelector),
    });
  }

  dispose() {
    if (this.joyrideRef) {
      this.joyrideRef.reset(true);
    }
  }

}
