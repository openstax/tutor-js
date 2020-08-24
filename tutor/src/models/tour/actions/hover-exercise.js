import { BaseAction, identifiedBy } from './base';

export default
@identifiedBy('tour/action/hover-exercise')
class Reposition extends BaseAction {

  beforeStep() {
    this.$('.card-body').classList.add('on-demo-hover');
  }

  afterStep() {
    this.$('.card-body').classList.remove('on-demo-hover');
  }

}
