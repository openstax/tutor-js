export {
  identifiedBy, identifier, belongsTo, field, computed,
} from 'shared/model';
import { delay, extend, pick } from 'lodash';
import { BaseModel, computed } from 'shared/model';

export class BaseAction extends BaseModel {

  constructor(options) {
    super();
    this.options = options;
    extend(this, pick(this.options, 'step', 'ride', 'selector'));
  }

  repositionAfter(ms) {
    delay(() => this.ride.joyrideRef.calcPlacement(), ms);
  }

  get document() {
    return this.ride.window.document;
  }

  @computed get el() {
    return this.document.querySelector(this.selector);
  }

  $(selector) {
    return this.el.querySelector(selector);
  }

  beforeStep() {

  }

  afterStep() {

  }

}
