import { BaseAction, identifiedBy } from './base';
import { delay } from 'lodash';

export default
@identifiedBy('tour/action/reposition')
class Reposition extends BaseAction {

  beforeStep() {
    delay(() => this.ride.joyrideRef.calcPlacement(), 550);
  }

};
