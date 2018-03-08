import React from 'react';
import { observer } from 'mobx-react';
import { observable, autorun, action } from 'mobx';
import Toasts from '../../models/toasts';

const REMOVE_AFTER = 1000 * 7;

@observer
export default class BackgroundToasts extends React.Component {

  queuePopperStop = autorun(() => {
    if (!this.currentJob && Toasts.length) {
      this.currentToast = Toasts.shift();
      if (this.currentToast.isOk) {
        this.pendingRemoval = setTimeout(this.removeJob, REMOVE_AFTER);
      }
    }
  })

  @observable currentToast;
  @observable pendingRemoval;

  @action.bound removeJob() {
    this.currentToast = null;
  }

  componentWillUnmount() {
    this.queuePopperStop();
    if (this.pendingRemoval) {
      clearTimeout(this.pendingRemoval);
    }
  }

  render() {
    if (!this.currentToast) { return null; }

    const Toast = this.currentToast.component;

    return (
      <div className="background-job-toast">
        <Toast job={this.currentToast} dismiss={this.removeJob} />
      </div>
    );
  }

}
