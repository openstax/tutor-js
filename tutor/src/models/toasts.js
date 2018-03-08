import { readonly } from 'core-decorators';
import { createCollection } from 'mobx-decorated-models';
import { uniqueId } from 'lodash';
import invariant from 'invariant';
import {  computed } from 'mobx';
import {
  BaseModel, identifiedBy, session,
} from 'shared/model';
//
// import * as lms from '../components/toasts/lms';
// import * as scores from '../components/toasts/scores';
//
// const JobToasts = { lms, scores };
//
const Handlers  = {
  job(toast) {
    invariant(['ok', 'failed'].includes(toast.state), 'job state must be ok or failed');
    return JobToasts[toast.state == 'ok' ? 'Success' : 'Failure'];
  },
  generic() {
    //return Toast;
  },
};

@identifiedBy('toast')
export class ToastModel extends BaseModel {

  @readonly id = uniqueId('toast-');
  @session handler;
  @session status;
  @session type;
  @session info; //({ type: 'object' }) info;

  @computed get isOk() {
    return 'ok' === this.status;
  }

  @computed get component() {
    return (Handlers[this.type] || Handlers.generic)(this);
  }
}


const ToastsStore = createCollection({ model: ToastModel });

export default ToastsStore;
