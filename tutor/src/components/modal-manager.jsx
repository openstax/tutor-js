import PropTypes from 'prop-types';
import React from 'react';
import { action, observable, observe } from 'mobx';
import { Provider, observer } from 'mobx-react';
import { createTransformer } from 'mobx-utils';
import PriorityQueue from 'js-priority-queue';

export default
@observer
class ModalManager extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  @observable active = null;
  observerDisposes = [];
  priorityQueue = new PriorityQueue({ comparator: (a, b) => { return a.priority - b.priority } });

  canDisplay = createTransformer(model => this.active == model);

  @action.bound next() {
    while (this.observerDisposes.length > 0) {
      this.observerDisposes.pop()();
    }

    this.active = null;

    const requeue = [];
    while (this.priorityQueue.length > 0) {
      const peek = this.priorityQueue.peek();
      if (peek.isReady) {
        this.active = peek;
        // wait for the current modal to stop being ready
        this.observerDisposes.push(observe(peek, 'isReady', this.next));
        break;
      }
      requeue.push(this.priorityQueue.dequeue());
    }

    for (const model of requeue) {
      this.priorityQueue.queue(model);
      if (!this.active) {
        // no modal is currently active, so wait for any modal to be ready
        this.observerDisposes.push(observe(model, 'isReady', this.next));
      }
    }
  }

  @action.bound queue(model) {
    this.priorityQueue.queue(model);
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

};
