import {
  BaseModel, identifiedBy, field, hasMany,
} from './base';
import {  extend } from 'lodash';
import { action, observable, when,computed } from 'mobx';
import loadjs from 'loadjs';
import { readonly } from 'core-decorators';
import invariant from 'invariant';
import { Logging } from 'shared';
import User from './user';

const REQUIRED_OPTIONS = [
  'course',
];

@identifiedBy('payments')
export default class Payments extends BaseModel {

  @readonly static config = observable({
    base_url: '',
    js_url: '',
    is_enabled: false,
    product_uuid: '',
  });

  static bootstrap(data) {
    extend(this.config, data);
  }

  @observable isBusy = false;
  @observable errorMessage = ''
  @observable element;
  @observable parentCallbacks;

  constructor(options) {
    super();
    this.options = options;
    REQUIRED_OPTIONS.forEach((key) =>
      invariant(options[key], `option ${key} was not set for payments`));
    when(
      () => !!this.element,
      this.fetch,
    );
  }

  close() {
    if (this.remote) {
      this.remote.close();
    }
  }

  @computed get callbacks() {
    return extend({}, this.parentCallbacks, {

    });
  }

  @computed get hasError() {
    return Boolean(this.errorMessage);
  }

  @action.bound
  fetch() {
    if (!EMBED_URL) { return this.logFailure('Attempted to load payments without a url set'); }
    this.isBusy = true;
    if (window.OSPayments) { // may already be loaded
      return this.createIframe();
    } else {
      return loadjs(EMBED_URL, {
        success: this.createIframe,
        error: (e) => this.logFailure(`Unable to request assets: ${e}`),
      });
    }
  }

  logFailure(msg) {
    this.errorMessage = msg;
    this.isBusy = false;
    Logging.error(msg);
  }

  get remotePaymentOptions() {

    const { options: { course } } = this;
    return extend({}, this.options, {
      product_uuid: PRODUCT_UUID,
      purchaser_account_uuid: User.account_uuid,
      product_end_date: course.ends_at,
      product_instance_uuid: course.userStudentRecord.uuid,
      course_uuid: course.uuid,
    });
  }

  @action.bound
  createIframe() {
    const { OSPayments } = window;
    this.remote = new OSPayments(this.remotePaymentOptions);
    this.remote.createIframe(this.element).then(() => {
      this.isBusy = false;
    });
  }

}
