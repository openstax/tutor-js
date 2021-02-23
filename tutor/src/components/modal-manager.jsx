import PropTypes from 'prop-types';
import React from 'react';
import { action, observable, observe } from 'mobx';
import { Provider, observer } from 'mobx-react';
import { createTransformer } from 'mobx-utils';

@observer
export default
class ModalManager extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  @observable active = null;
  priorityQueue = [];
  observerDisposes = [];

  canDisplay = createTransformer(modal => this.active == modal);

  @action.bound next() {
    while (this.observerDisposes.length > 0) {
      this.observerDisposes.pop()();
    }

    this.active = null;

    for (const modal of this.priorityQueue) {
      if (modal && modal.isReady) {
        this.active = modal;
        // wait for the current modal to stop being ready
        this.observerDisposes.push(observe(modal, 'isReady', this.next));
        break;
      }
    }

    if (!this.active) {
      // no modal is currently ready, so wait for any modal to become ready
      for (const modal of this.priorityQueue) {
        if (modal) {
          this.observerDisposes.push(observe(modal, 'isReady', this.next));
        }
      }
    }
  }

  @action.bound queue(modal, priority) {
    // modals with the same priority will overwrite whichever modal was previously in the queue
    this.priorityQueue[priority] = modal;

    // calling this method may interrupt running modals
    this.next();
  }

  render() {
    return (
      <Provider modalManager={this}>
        {this.props.children}
      </Provider>
    );
  }

}
