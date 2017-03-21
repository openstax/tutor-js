import {
  BaseModel, identifiedBy, belongsTo, computed,
} from '../base';
import { defaults } from 'lodash';
import { action } from 'mobx';
import { compact, extend } from 'lodash';
import User from '../user';

const DEFAULT_JOYRIDE_CONFIG = {
  run: true,
  type: 'continuous',
  autoStart: true,
  debug: false,
  scrollToSteps: true,
  scrollToFirstStep: true,
  scrollOffset: 120, // below top navbar
  resizeDebounce: true,
  resizeDebounceDelay: 200,
};

@identifiedBy('tour/ride')
export default class TourRide extends BaseModel {

  @belongsTo({ model: 'tour' }) tour;
  @belongsTo({ model: 'tour/context' }) context;
  @belongsTo({ model: 'tour/region' }) region;

  @computed get joyrideProps() {
    const { tour } = this;
    if (!tour) { return {}; }
    return defaults({
      callback: this.joyrideCallback,
      tourId: tour.id,
      ref: ref => (this.joyrideRef = ref),
      steps: compact(this.tour.steps.map(step => this.stepForRide(step))),
    }, DEFAULT_JOYRIDE_CONFIG);
  }

  @action.bound
  joyrideCallback({ type, action, step: joyRideStep }) {
    if (action === 'close' || (action === 'next' && type == 'finished')) {
      User.viewedTour(this.tour, { exitedEarly: action === 'close' });
      return; // no step data, nothing more to do
    }
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

    return extend(step.joyrideStepProperties, {
      step,
      selector: (step.anchor_id ? this.context.anchors.get(step.anchor_id) : this.region.domSelector),
    });

  }
}
