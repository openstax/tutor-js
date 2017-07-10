import {
  BaseModel, identifiedBy, field, hasMany,
} from './base';
import {  extend } from 'lodash';
import { action, observable, when,computed } from 'mobx';
import loadjs from 'loadjs';
import invariant from 'invariant';

import User from './user';

let EMBED_URL = '';

const REQUIRED_OPTIONS = [
  'course',
  'product_uuid',
];

@identifiedBy('payments')
export default class Payments extends BaseModel {

  static set embed_js_url(url) {
    EMBED_URL = url;
  }

  @observable isBusy = false;
  @observable errorMsg = ''
  @observable element;
  @observable parentCallbacks;

  constructor(options) {
    super();
    this.options = options;
    REQUIRED_OPTIONS.forEach((key) =>
      invariant(options[key], `option ${key} was not set for payments`));
    when(
      () => this.element && EMBED_URL,
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

  @action.bound
  fetch() {
    this.isBusy = true;
    if (window.OSPayments) { // may already be loaded
      this.createIframe();
    } else {
      loadjs(EMBED_URL, {
        success: this.createIframe,
        error: (e) => this.errorMsg = `Unable to request assets: ${e}`,
      });
    }
  }

  get remotePaymentOptions() {
//
    const BAD_UUID = '00000000-0000-0000-0000-000000000000';
    const { options: { course } } = this;
    return extend({}, this.options, {
      purchaser_account_uuid: BAD_UUID, // User.account_uuid,
      product_end_date: course.ends_at, // TODO: course doesn't currently have the below UUIDs from BE
      product_instance_uuid: course.primaryRole.membership_uuid || BAD_UUID,
      course_uuid: course.uuid || BAD_UUID,
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
