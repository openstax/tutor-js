import {
  BaseModel, identifiedBy, field, hasMany,
} from './base';

import { action, observable, when } from 'mobx';
import loadjs from 'loadjs';

let EMBED_URL = '';

@identifiedBy('payments')
export default class Payments extends BaseModel {

  static set embed_js_url(url) {
    EMBED_URL = url;
  }

  @observable isBusy = false;
  @observable errorMsg = ''
  @observable element;

  constructor() {
    super();
    when(
      () => this.element && EMBED_URL,
      this.fetch,
    );
  }

  @action.bound fetch() {
    this.isBusy = true;

    loadjs(EMBED_URL, {
      success: this.createIframe,
      error: (e) => this.errorMsg = `Unable to request assets: ${e}`,
    });

  }

  @action.bound createIframe() {
    const { OSPayments } = window;
    this.remote = new OSPayments(this.params);
    this.remote.createIframe(this.element).then(() => {
      this.isBusy = false;
    });
  }


}
