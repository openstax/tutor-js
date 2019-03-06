// coffeelint: disable=no_empty_functions
import React from 'react';
import actions from './actions';
import checks from './checks';
import { TaskStore } from '../../../../src/flux/task';
import TaskStep from '../../../../src/components/task-step';

import { routerStub, componentStub, commonActions } from '../utilities';

const tests = {
  delay: 200,
  container: document.createElement('div'),

  unmount() {
    React.unmountComponentAtNode(this.container);
    return this.container = document.createElement('div');
  },

  _renderTaskStep(stepId, taskId, courseId, onNextStep, goToStep) {
    const div = this.container;
    return componentStub._render(div,
      <TaskStep
        id={stepId}
        taskId={taskId}
        courseId={courseId}
        goToStep={goToStep}
        onNextStep={onNextStep} />,
      { stepId, taskId });
  },

  renderStep(taskId, courseId) {
    const { id } = TaskStore.getCurrentStep(taskId);

    // TODO Do something for these handlers
    const onNextStep = function() {};
    const goToStep = function(num) {};

    return this._renderTaskStep(id, taskId, courseId, onNextStep, goToStep);
  },

  goToTask(route, taskId) {
    const div = this.container;
    const { id } = TaskStore.getCurrentStep(taskId);
    return routerStub._goTo(div, route, { stepId: id, taskId });
  },

  // convenience methods
  renderFreeResponse(taskId) {
    return this.renderStep(taskId);
  },

  answerFreeResponse(...args) {
    const steps = [
      actions.fillFreeResponse,
    ];
    return commonActions.playThroughFunctions(steps)(...Array.from(args || []));
  },

  submitFreeResponse(...args) {
    const steps = [
      actions.fillFreeResponse,
      actions.saveFreeResponse,
    ];
    return commonActions.playThroughFunctions(steps)(...Array.from(args || []));
  },

  answerMultipleChoice(...args) {
    const steps = [
      actions.fillFreeResponse,
      actions.saveFreeResponse,
      actions.pickMultipleChoice,
    ];
    return commonActions.playThroughFunctions(steps)(...Array.from(args || []));
  },

  submitMultipleChoice(...args) {
    const steps = [
      actions.fillFreeResponse,
      actions.saveFreeResponse,
      actions.pickMultipleChoice,
      actions.saveMultipleChoice,
    ];
    return commonActions.playThroughFunctions(steps)(...Array.from(args || []));
  },

  workExerciseAndCheck(...args) {
    const steps = [
      checks.checkIsDefaultStep,
      actions.fillFreeResponse,
      actions.clickContinue,
      checks.checkAnswerFreeResponse,
      actions.saveFreeResponse,
      checks.checkSubmitFreeResponse,
      actions.pickMultipleChoice,
      checks.checkAnswerMultipleChoice,
      actions.saveMultipleChoice,
      checks.checkSubmitMultipleChoice,
    ];
    return commonActions.playThroughFunctions(steps)(...Array.from(args || []));
  },

  workExercise(...args) {
    const steps = [
      actions.fillFreeResponse,
      actions.saveFreeResponse,
      actions.pickMultipleChoice,
      actions.saveMultipleChoice,
    ];
    return commonActions.playThroughFunctions(steps)(...Array.from(args || []));
  },

  workTrueFalseAndCheck(...args) {
    const steps = [
      actions.pickMultipleChoice,
      checks.checkAnswerMultipleChoice,
      actions.saveMultipleChoice,
      checks.checkSubmitMultipleChoice,
    ];
    return commonActions.playThroughFunctions(steps)(...Array.from(args || []));
  },
};

export { tests as taskTests, actions as taskActions, checks as taskChecks };
