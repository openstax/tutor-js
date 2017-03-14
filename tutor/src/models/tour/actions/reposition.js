import { BaseAction, identifiedBy } from './base';
import { delay } from 'lodash';

@identifiedBy('tour/action/reposition')
export default class Reposition extends BaseAction {

  beforeStep() {
    delay(() => this.ride.joyrideRef.calcPlacement(), 550);
  }

}
