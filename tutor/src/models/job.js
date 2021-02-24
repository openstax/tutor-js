import {
    BaseModel, identifiedBy, identifier, session,
} from 'shared/model';
import { last } from 'lodash';
import { action, observable, computed } from 'mobx';

import invariant from 'invariant';

const MAX_ATTEMPTS = 50;

@identifiedBy('job')
export default class Job extends BaseModel {

  @identifier jobId;

  @observable pollingId;
  @session attempts = 0;
  @session interval = 5;
  @session maxAttempts = 30;
  @session status;
  @session progress;

  @action.bound
  checkForUpdate() {
      if (this.attempts < this.maxAttempts) {
          this.attempts += 1;
          this.requestJobStatus();
      } else {
          this.stopPolling();
          this.onPollTimeout();
      }
  }

  @computed get isComplete() {
      return 'succeeded' === this.status || 'failed' === this.status;
  }

  @computed get hasFailed() {
      return Boolean(this.attempts >= this.maxAttempts || 'failed' === this.status);
  }

  // match existing API; right now these do the same but might not later
  @computed get isPolling() { return Boolean(this.pollingId);  }
  @computed get isPending() { return Boolean(this.pollingId);  }

  @computed get jobStatus() {
      if (this.isComplete) { return 'succeeded'; }
      if (this.isPending)  { return 'started';   }
      if ( this.hasFailed) { return 'failed';    }
      return 'unknown';
  }

  startPolling(job) {
      this.jobId = last(job.split('/'));
      invariant((!this.pollingId || this.pollingId === 'pending'),
          'poll already in progress, cannot start polling twice!');
      invariant(this.jobId, 'job url is not set');
      this.attempts = 0;
      this.pollingId = setTimeout(this.checkForUpdate, this.interval * 1000);
  }

  stopPolling() {
      clearInterval(this.pollingId);
      this.pollingId = null;
  }

  // overriden by child
  onPollComplete() { }
  onPollTimeout() {}
  onPollFailure() {}

  // called by API
  requestJobStatus() { }

  onJobUpdateFailure() {
      this.stopPolling();
      this.onPollFailure();
  }

  onJobUpdate({ data }) {
      this.update(data);
      if (this.isComplete) {
          this.stopPolling();
          this.onPollComplete(data);
      } else {
          this.pollingId = setTimeout(this.checkForUpdate, this.interval * 1000);
      }
  }
}
