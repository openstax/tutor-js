import { ld, TestUtils } from '../../../helpers';
import { TaskStepActions, TaskStepStore } from '../../../../src/flux/task-step';
import { TaskActions, TaskStore } from '../../../../src/flux/task';
import { StepPanel } from '../../../../src/helpers/policies';

import TaskStep from '../../../../src/components/task-step';
import { BreadcrumbTaskDynamic } from '../../../../src/components/breadcrumb';
import { Exercise } from 'shared';

import { routerStub, commonActions } from '../utilities';

const actions = {
  forceUpdate(...args) {
    const { component, div } = args[0];
    const taskStep = TestUtils.scryRenderedComponentsWithType(component, TaskStep);
    const breadcrumbs = TestUtils.scryRenderedComponentsWithType(component, BreadcrumbTaskDynamic);

    if (breadcrumbs.length === 1) {
      routerStub.forceUpdate(breadcrumbs[0], ...Array.from(args));
    }

    if (taskStep.length === 1) {
      return routerStub.forceUpdate(taskStep[0], ...Array.from(args));
    } else {
      return routerStub.forceUpdate(component, ...Array.from(args));
    }
  },

  clickContinue(...args) {
    const { div, stepId } = args[0];

    if (div.querySelectorAll('.paging-control.next').length !== 0) {
      // to work around asynchronous transition on arrow next
      // click on it twice
      commonActions.clickMatch('.paging-control.next')(...Array.from(args || []));
    }

    return commonActions.clickMatch('.paging-control.next, .continue')(...Array.from(args || []));
  },

  clickTryAnother: commonActions.clickMatch('.-try-another'),

  // Tricky, popovers use focus trigger for dismissable option
  // http://getbootstrap.com/javascript/#dismiss-on-next-click
  triggerDetails: commonActions.hoverMatch('.task-details .task-details-instructions'),

  _clickBreadcrumb(breadcrumbButtonIndex, { div, component, stepId, taskId, state, router, history }) {
    let breadcrumbs = div.querySelectorAll('.openstax-breadcrumbs-step');
    breadcrumbs = Array.prototype.slice.call(breadcrumbs);

    commonActions.click(breadcrumbs[breadcrumbButtonIndex]);
    const steps = TaskStore.getStepsIds(taskId);

    if (breadcrumbButtonIndex !== steps.length) {
      // change step
      stepId = steps[breadcrumbButtonIndex].id;
    }

    return { div, component, stepId, taskId, state, router, history };
  },

  clickBreadcrumb(breadcrumbButtonIndex) {
    return (...args) => Promise.resolve(actions._clickBreadcrumb(breadcrumbButtonIndex, ...Array.from(args)));
  },

  fillFreeResponse: commonActions.fillTextarea('textarea', 'Test Response'),

  saveFreeResponse({ div, component, stepId, taskId, state, router, history, textarea }) {
    commonActions.clickButton(div, '.continue');
    const result = TaskStepStore.get(stepId);
    result.free_response = textarea.value;
    TaskStepActions.saved(result, stepId);

    return actions.forceUpdate({ div, component, stepId, taskId, state, router, history });
  },

  pickMultipleChoice({ div, component, stepId, taskId, state, router, history }) {
    const step = TaskStepStore.get(stepId);
    const answer = step.content.questions[0].answers[0];
    const answerElement = div.querySelector('.answer-input-box');

    TestUtils.Simulate.change(answerElement, answer);
    step.answer_id = answer.id;
    TaskStepActions.saved(step, stepId);

    return actions.forceUpdate({ div, component, stepId, taskId, state, router, history, answer });
  },

  saveMultipleChoice({ div, component, stepId, taskId, state, router, history }) {
    const step = TaskStepStore.get(stepId);
    const correct_answer = step.content.questions[0].answers[1];
    commonActions.clickButton(div, '.continue');
    const canReview = StepPanel.canReview(stepId);
    let feedback_html = '';

    if (canReview) {
      if (step.correct_answer_id == null) { step.correct_answer_id = correct_answer.id; }
      feedback_html = 'Fake Feedback';
      step.feedback_html = feedback_html;
    }

    step.is_completed = true;
    TaskStepActions.completed(step, stepId);

    return actions.forceUpdate({ div, component, stepId, taskId, state, router, history, correct_answer, feedback_html });
  },

  updateStep(newStepId, { div, component, stepId, taskId, state, router, history }) {
    return actions.forceUpdate({ div, component, stepId: newStepId, taskId, state, router, history });
  },

  _advanceStep({ div, component, stepId, taskId, state, router, history }) {
    // step = TaskStepStore.get(stepId)
    // step.is_completed = true
    // TaskStepActions.completed(step, stepId)

    const stepIndex = TaskStore.getCurrentStepIndex(taskId);
    const steps = TaskStore.getStepsIds(taskId);

    // advance step
    const oldStepId = stepId;
    stepId = steps[stepIndex].id;
    return actions.updateStep(stepId, { div, component, oldStepId, taskId, state, router, history });
  },

  advanceStep(...args) {
    return Promise.resolve(actions._advanceStep(...Array.from(args || [])));
  },

  _playThroughActions(actionsToPlay) {
    return function(...args) {
      const actionsFns = _.map(actionsToPlay, action => actions[action]);

      return commonActions.playThroughFunctions(actionsFns)(...Array.from(args || []));
    };
  },

  _loadStep(stepId, stepData, ...args) {
    const { taskId } = args[0];
    TaskStepActions.loaded(stepData, stepId, taskId);
    return args[0];
  },

  loadStep(stepId, stepData) {
    return (...args) => Promise.resolve(actions._loadStep(stepId, stepData, ...Array.from(args)));
  },

  _loadRecovery(stepId, stepData, ...args) {
    TaskStepActions.loadedRecovery(stepData, stepId);
    return args[0];
  },

  loadRecovery(stepId, stepData) {
    return (...args) => Promise.resolve(actions._loadRecovery(stepId, stepData, ...Array.from(args)));
  },

  _loadTask(taskData, ...args) {
    const { taskId } = args[0];
    TaskActions.loaded(taskData, taskId);
    return args[0];
  },

  loadTask(taskData) {
    return (...args) => Promise.resolve(actions._loadTask(taskData, ...Array.from(args)));
  },

  forceRecovery(...args) {
    const { component } = args[0];
    const exerciseReview = TestUtils.findRenderedComponentWithType(component, Exercise);
    exerciseReview.props.onNextStep();

    return actions.forceUpdate(args[0]);
  },

  completeThisStep(...args) {
    const { stepId } = args[0];
    const actionsForStep = StepPanel.getRemainingActions(stepId);
    return actions._playThroughActions(actionsForStep)(...Array.from(args || []));
  },

  _getActionsForTaskCompletion(taskId) {
    const incompleteSteps = TaskStore.getIncompleteSteps(taskId);
    const allSteps = TaskStore.getSteps(taskId);

    const actionsToPlay = _.chain(incompleteSteps).map(function(step, index) {
      const actionsForStep = StepPanel.getRemainingActions(step.id);
      if (index < (incompleteSteps.length - 1)) {
        actionsForStep.push('advanceStep');
      }
      return actionsForStep;
    }).flatten().value();

    // a cricket for good luck
    actionsToPlay.push('forceUpdate');
    return actionsToPlay;
  },

  completeSteps(...args) {
    const { taskId } = args[0];
    const actionsToPlay = actions._getActionsForTaskCompletion(taskId);

    return actions._playThroughActions(actionsToPlay)(...Array.from(args || []));
  },
};


export default actions;
