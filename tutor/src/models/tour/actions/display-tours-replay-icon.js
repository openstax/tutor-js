import { BaseAction, identifiedBy } from './base';

@identifiedBy('tour/action/display-tours-replay-icon')
export default class DisplayToursReplayIcon extends BaseAction {

  beforeStep() {
    this.ride.context.forcePastToursIndication = true;
  }

}
