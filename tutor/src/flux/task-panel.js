import _ from 'underscore';
import { makeSimpleStore } from './helpers';

import { TaskStore } from '../flux/task';
import { StepTitleStore } from '../flux/step-title';
import { TaskHelper } from 'shared';

const TaskPanel = {
  _steps: {},

  loaded(task, taskId) {
    this._steps[taskId] = TaskHelper.mapSteps(task);
    return this.emit('loaded');
  },

  sync(taskId) {
    const task = TaskStore.get(taskId);
    task.steps = TaskStore.getSteps(taskId);
    return this.loaded(task, taskId);
  },

  _get(taskId) {
    return _.where(this._steps[taskId], { isAvailable: true });
  },

  exports: {
    get(id) { return this._get(id); },
    getStep(id, stepIndex) { return this._get(id)[stepIndex]; },
    getStepByKey(id, stepKey) { return this.exports.getStep.call(this, id, stepKey - 1); },

    getNextStepTitle(id, taskStepId) {
      const steps = this._get(id);
      const index = _.findIndex(steps, { id: taskStepId });
      const nextStep = index === -1 ? null : steps[index + 1];
      if (nextStep) { return StepTitleStore.getTitleForCrumb(nextStep); } else { return ''; }
    },

    getStepIndex(id, stepInfo) {
      const steps = this._get(id);
      const stepIndex = _.findIndex(steps, stepInfo);
      if (stepIndex === -1) { return null; }
      return stepIndex;
    },

    getStepKey(id, stepInfo) {
      return this.exports.getStepIndex.call(this, id, stepInfo) + 1;
    },

    getProgress(id, stepIndex) {
      const steps = this._steps[id];

      if (steps.length) {
        return ((stepIndex + 1) / (steps.length)) * 100;
      } else {
        return 0;
      }
    },

    getTitlesForStepIndex(taskId, stepIndex) {
      let previous;
      const crumbs = this._get(taskId); // TaskPanelStore.get(@props.id)
      if (stepIndex >= 0) { previous = crumbs[stepIndex - 1]; }
      const next = crumbs[stepIndex + 1];

      return {
        previous: previous && StepTitleStore.getTitleForCrumb(previous),
        current: StepTitleStore.getTitleForCrumb(crumbs[stepIndex]),
        next: next && StepTitleStore.getTitleForCrumb(next),
      };
    },
  },
};

const { actions, store } = makeSimpleStore(TaskPanel);

TaskStore.on('step.completed', (stepId, taskId) => actions.sync(taskId));

export { actions as TaskPanelActions, store as TaskPanelStore };
