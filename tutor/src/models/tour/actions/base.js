export {
  identifiedBy, identifier, belongsTo, field, computed,
} from '../../base';
import { extend, pick } from 'lodash';
import { BaseModel, computed } from '../../base';

export class BaseAction extends BaseModel {

  constructor(options) {
    super();
    this.options = options;
    extend(this, pick(this.options, 'step', 'ride', 'selector'));
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
