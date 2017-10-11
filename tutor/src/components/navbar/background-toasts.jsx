import React from 'react';
import { observer } from "mobx-react";
import { observable, autorun, action } from 'mobx';
import  { Completed as JobCompletion } from '../../models/jobs/queue';
import * as lms from './toasts/lms';
import * as scores from './toasts/scores';

const REMOVE_AFTER = 1000 * 10;

const Toasts = {
  lms,
  scores,
};

@observer
export default class BackgroundToasts extends React.Component {

  queuePopperStop = autorun(() => {
    if (!this.currentJob && JobCompletion.length) {
      this.currentJob = JobCompletion.shift();
      if (this.currentJob.succeeded) {
        this.pendingRemoval = setTimeout(this.removeJob, REMOVE_AFTER);
      }
    }
  })

  @observable currentJob;
  @observable pendingRemoval;

  @action.bound removeJob() {
    this.currentJob = null;
  }

  componentWillUnmount() {
    this.queuePopperStop();
    if (this.pendingRemoval) {
      clearTimeout(this.pendingRemoval);
    }
  }

  render() {
    if (!this.currentJob) { return null; }
    const ToastType = Toasts[this.currentJob.type];
    const Toast = ToastType[this.currentJob.succeeded ? 'Success' : 'Failure'];
    return (
      <div className="background-job-toast">
        <Toast job={this.currentJob} dismiss={this.removeJob} />
      </div>
    );
  }

}
