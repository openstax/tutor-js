import {
  BaseModel, identifiedBy, identifier, session,
} from './base';
import { merge, extend, defer, last } from 'lodash';
import { action, observable, when,computed } from 'mobx';

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
    console.log("CHECK FOR UPDATE", this.attempts, this.maxAttempts)
    if (this.attempts < this.maxAttempts) {
      this.attempts += 1;
      // skip if updates are stacking up
      if (!this.hasApiRequestPending) { this.updateJobStatus(); }
    } else {
      this.stopPolling()
      this.onPollTimeout();
    }
  }

  @computed get isComplete() {
    return 'succeeded' === this.status;
  }

  @computed get hasFailed() {
    return Boolean(this.attempts >= this.maxAttempts)
  }

  @computed get isPending() {
    return Boolean(this.pollingId);
  }

  startPolling(job) {
    this.jobId = last(job.split('/'))
    console.log("START PULL",   this.interval, this.interval * 1000)
    invariant(!this.pollingId, 'poll already in progress, cannot start polling twice!');
    invariant(this.jobId, 'job url is not set');
    this.attempts = 0;
    this.pollingId = setInterval(this.checkForUpdate, this.interval * 1000);
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
  updateJobStatus() { }

  onJobUpdateFailure() {
    this.stopPolling()
    this.onPollFailure();
  }

  onJobUpdate({ data }) {
    this.update(data);
    if (this.isComplete) {
      this.stopPolling()
      this.onPollComplete(data);
    }
  }
}

  //
  //   import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
  //   import _ from 'underscore';
  //
  //   const JobConfig = {
  //
  //     _checkUntil: {},
  //
  //     _loaded(obj, id) {
  //       // if this job is in checking mode
  //       let jobData;
  //       if (this._checkUntil[id] != null) {
  //         const { finalStatus, checkJob, count, maxRepeats, interval } = this._checkUntil[id];
  //         this._checkUntil[id].count = count + 1;
  //         jobData = _.extend({}, obj, { id });
  //
  //         // unless the final status has been reached or
  //         // the max times this job should be checked has be exceeded,
  //         // check this job
  //         if ((finalStatus.indexOf(jobData.status) <= -1) && (this._checkUntil[id].count <= maxRepeats)) {
  //           // if job status has checked, emit an update
  //           const previousJobData = this._get(id);
  //           if (__guard__(previousJobData, x => x.status) !== obj.status) { this.emit(`job.${id}.updated`, jobData); }
  //
  //           setTimeout(checkJob, interval);
  //         } else {
  //           // otherwise, stop the checking, and emit the current status as the final status
  //           this.emit(`job.${id}.final`, jobData);
  //           delete this._checkUntil[id];
  //         }
  //       }
  //
  //       return jobData;
  //     },
  //
  //     // load in to store on fail.
  //     _failed(obj, id) {
  //       return this.loaded(obj, id);
  //     },
  //
  //     checkUntil(id, checkJob, interval, maxRepeats, finalStatus) {
  //       if (interval == null) { interval = 1000; }
  //       if (maxRepeats == null) { maxRepeats = 50; }
  //       if (finalStatus == null) { finalStatus = ['succeeded', 'failed', 'killed', 404]; }
  //       if (this._checkUntil[id] == null) {
  //       this._checkUntil[id] = { checkJob, finalStatus, interval, maxRepeats, count: 0 };
  //       return checkJob();
  //     }
  //   },
  //
  //   stopChecking(id) {
  //     return delete this._checkUntil[id];
  //   },
  //
  //   exports: {
  //
  //     getStatus(id) {
  //       const { status } = this._get(id);
  //       return status;
  //     },
  //   },
  //
  // };
  //
  // extendConfig(JobConfig, new CrudConfig());
  // const { actions, store } = makeSimpleStore(JobConfig);
  // export { actions as JobActions, store as JobStore };
  //
  // function __guard__(value, transform) {
  //   return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
  // }
