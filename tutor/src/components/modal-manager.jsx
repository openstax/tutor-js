import PropTypes from 'prop-types';
import React from 'react';
import { action, observable, observe } from 'mobx';
import { Provider, observer } from 'mobx-react';
import { createTransformer } from 'mobx-utils';

export default
@observer
class ModalManager extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  @observable active = null;
  observerDisposes = [];
  priorityQueue = [];

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

  // we do not support multiple modals with the same priority,
  // so make sure the priorities are all different when calling this method
  @action.bound queue(model, priority) {
    this.priorityQueue[priority] = model;
  }

  @action.bound start() {
    if (!this.active) {
      this.next();
    }
  }

  render() {
    return (
      <Provider modalManager={this}>
        {this.props.children}
      </Provider>
    );
  }

}
