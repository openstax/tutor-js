import { BaseAction, identifiedBy } from './base';

export default
@identifiedBy('tour/action/hover-exercise')
class Reposition extends BaseAction {

  beforeStep() {
    this.$('.panel-body').classList.add('on-demo-hover');
  }

  afterStep() {
    this.$('.panel-body').classList.remove('on-demo-hover');
  }

}
