import { readonly } from 'core-decorators';
import { createCollection } from 'mobx-decorated-models';
import { uniqueId } from 'lodash';
import invariant from 'invariant';
import {  computed } from 'mobx';
import {
  BaseModel, identifiedBy, session,
} from 'shared/model';

import * as lms from '../components/toasts/lms';
import * as scores from '../components/toasts/scores';
import Reload from '../components/toasts/reload';

const JobToasts = { lms, scores };

const Handlers  = {
  job(toast) {
    invariant(['ok', 'failed'].includes(toast.status), 'job status must be ok or failed');
    return JobToasts[toast.type][toast.status == 'ok' ? 'Success' : 'Failure'];
  },
  reload() {
    return Reload;
  },
};

@identifiedBy('toast')
export class ToastModel extends BaseModel {

  @readonly id = uniqueId('toast-');
  @session handler;
  @session status;
  @session type;
  @session({ type: 'object' }) info;

  @computed get isOk() {
    return 'ok' === this.status;
  }

  @computed get component() {
    const handler = Handlers[this.handler];
    invariant(handler, `Handler type for '${this.handler}' was not found`);
    return handler(this);
  }
}


const ToastsStore = createCollection({ model: ToastModel });

export default ToastsStore;
