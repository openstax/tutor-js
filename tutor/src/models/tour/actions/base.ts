export {
    identifier, model, field, computed,
} from 'shared/model';
import { extend, pick } from 'lodash';
import { BaseModel, computed } from 'shared/model';

export class BaseAction extends BaseModel {

    constructor(options) {
        super();
        this.options = options;
        extend(this, pick(this.options, 'step', 'ride', 'selector'));
    }

    get document() {
        return window.document;
    }

  @computed get el() {
        return this.step.element;
    }

  $(selector) {
      return this.el.querySelector(selector);
  }

  beforeStep() {
      return Promise.resolve();
  }

  afterStep() {
      return Promise.resolve();
  }

  // the default implementation does nothing
  preValidate() {}
}
