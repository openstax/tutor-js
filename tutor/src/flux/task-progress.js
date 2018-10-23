import _ from 'underscore';

import { makeSimpleStore } from './helpers';

const TaskProgressConfig = {
  _local: {},

  update(taskId, currentStep) {
    const previousStep = this._local[taskId];
    this._local[taskId] = currentStep;

    return this.emit(`update.${taskId}`, { previous: previousStep, current: currentStep });
  },

  reset(taskId) {
    if (taskId == null) { return; }
    const previousStep = this._local[taskId];
    this._local[taskId] = null;

    return this.emit(`reset.${taskId}`, { previous: previousStep });
  },

  resetAll() {
    return _.each(this._local, (progress, taskId) => {
      return this.reset(taskId);
    });
  },

  exports: {
    get(taskId) {
      return this._local[taskId];
    },
  },
};


const { actions, store } = makeSimpleStore(TaskProgressConfig);
export { actions as TaskProgressActions, store as TaskProgressStore };
