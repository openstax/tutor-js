import { BaseAction, identifiedBy } from './base';

@identifiedBy('tour/action/hover-exercise')
export default class Reposition extends BaseAction {

  beforeStep() {
    this.$('.panel-body').classList.add('on-demo-hover');
  }

  afterStep() {
    this.$('.panel-body').classList.remove('on-demo-hover');
  }

}
