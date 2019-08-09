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
  priorityQueue = new PriorityQueue({ comparator: (a, b) => { return b.priority - a.priority } });

  canDisplay = createTransformer(model => this.active == model);

  @action.bound next() {
    while (this.observerDisposes.length > 0) {
      this.observerDisposes.pop()();
    }

    this.active = null;

    const requeue = [];
    while (this.priorityQueue.length > 0) {
      const peek = this.priorityQueue.peek();
      if (peek.ready) {
        this.active = peek;
        this.observerDisposes.push(observe(peek, 'ready', this.next));
        break;
      }
      requeue.push(this.priorityQueue.dequeue());
    }

    for (const model of requeue) {
      this.priorityQueue.queue(model);
      if (!this.active) {
        this.observerDisposes.push(observe(model, 'ready', this.next));
      }
    }

    return !!this.active;
  }

  @action.bound queue(model) {
    this.priorityQueue.queue(model);

    if (!this.active) {
      this.next();
    }

    return this.canDisplay(model);
  }

  render() {
    return (
      <Provider modalManager={this}>
        {this.props.children}
      </Provider>
    );
  }

};
