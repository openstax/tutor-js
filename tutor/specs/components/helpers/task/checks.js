import { ld, TestUtils } from '../../../helpers';

import { TaskStepActions, TaskStepStore } from '../../../../src/flux/task-step';
import { TaskActions, TaskStore } from '../../../../src/flux/task';
import { StepPanel } from '../../../../src/helpers/policies';

import { BreadcrumbTaskDynamic } from '../../../../src/components/breadcrumb';
import ProgressBar from '../../../../src/components/task/progress';
import ProgressPanel from '../../../../src/components/task/progress/panel';
import { ExerciseGroup } from 'shared';

const checks = {
  _checkAllowContinue({ div, component, state, router, history }) {
    const continueButton = div.querySelector('.continue');
    expect(continueButton).to.not.be.null;
    expect(continueButton.disabled).to.not.be.ok;

    return { div, component, state, router, history };
  },

  _checkIsIntroScreen({ div, component, state, router, history }) {
    expect(div.querySelector('.-task-intro')).to.not.be.null;

    return { div, component, state, router, history };
  },

  _checkIsNotIntroScreen({ div, component, state, router, history }) {
    expect(div.querySelector('.-task-intro')).toBeNull();

    return { div, component, state, router, history };
  },

  _checkIsTargetStepId(targetStepId, { div, component, stepId, taskId, state, router, history }) {
    expect(stepId).toEqual(targetStepId);

    const step = TaskStepStore.get(targetStepId);

    const componentStepId = typeof component.getId === 'function' ? component.getId() : undefined;
    if (componentStepId) {
      expect(componentStepId).toEqual(targetStepId);
    }

    return { div, component, state, router, history };
  },

  _checkRenderFreeResponse({ div, component, stepId, taskId, state, router, history }) {
    const continueButton = div.querySelector('.continue');

    expect(div.querySelector('.answers-table')).toBeNull();
    expect(continueButton.disabled).toBe(true);

    // TODO
    // Will eventually test based on task type.  Assuming exercise with free
    // response for now.
    const step = TaskStepStore.get(stepId);
    expect(step.free_response).toBeUndefined();
    expect(div.querySelector('textarea').value).toEqual('');
    return { div, component, stepId, taskId, state, router, history };
  },

  _checkAnswerFreeResponse({ div, component, stepId, taskId, state, router, history, textarea }) {
    const step = TaskStepStore.get(stepId);
    expect(step.free_response.length).to.not.equal(0);
    expect(step.free_response).toEqual(textarea.value);
    return { div, component, stepId, taskId, state, router, history, textarea };
  },

  _checkSubmitFreeResponse({ div, component, stepId, taskId, state, router, history }) {
    const continueButton = div.querySelector('.continue');

    // Prevent continue until answer chosen, answers should be showing.
    expect(continueButton.disabled).toBe(true);
    expect(div.querySelector('.answers-table')).to.not.be.null;
    expect(div.querySelector('.answer-checked')).toBeNull();
    return { div, component, stepId, taskId, state, router, history };
  },

  _checkAnswerMultipleChoice({ div, component, stepId, taskId, state, router, history, answer }) {
    const step = TaskStepStore.get(stepId);
    const continueButton = div.querySelector('.continue');

    // Continue should be allowed
    expect(continueButton.disabled).to.not.be.ok;
    expect(step.answer_id).to.not.be.null;
    expect(step.answer_id).toEqual(answer.id);
    return { div, component, stepId, taskId, state, router, history, answer };
  },

  _checkSubmitMultipleChoice({ div, component, stepId, taskId, state, router, history, correct_answer, feedback_html }) {
    const canReview = StepPanel.canReview(stepId);

    if (canReview) {
      expect(div.querySelector('.answer-correct .answer-answer').innerText).toEqual(correct_answer.content_html);
      expect(div.querySelector('.answer-correct .answer-answer').innerHTML).to.not.equal(div.querySelector('.answer-checked').innerHTML);

      expect(div.querySelector('.question-feedback-content').innerHTML).toEqual(feedback_html);
    } else {
      expect(div.querySelector('.answer-correct .answer-answer')).toBeNull();
    }

    return { div, component, stepId, taskId, state, router, history, correct_answer, feedback_html };
  },

  _checkNotFeedback({ div, component, stepId, taskId, state, router, history }) {
    expect(div.querySelector('.question-feedback-content')).toBeNull();
    return { div, component, stepId, taskId, state, router, history };
  },

  _checkForFeedback({ div, component, stepId, taskId, state, router, history, correct_answer, feedback_html }) {
    expect(div.querySelector('.question-feedback-content').innerHTML).toEqual(feedback_html);
    return { div, component, stepId, taskId, state, router, history, correct_answer, feedback_html };
  },

  _checkRecoveryContent({ div, component, stepId, taskId, state, router, history }) {
    expect(div.innerText).to.contain('recovery');
    expect(div.querySelector('.task-footer-buttons')).toBeNull();
    expect(div.querySelector('.continue')).to.not.be.null;

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkIsNextStep({ div, component, stepId, taskId, state, router, history }) {
    const stepIndex = TaskStore.getCurrentStepIndex(taskId);
    const steps = TaskStore.getStepsIds(taskId);
    const targetStepId = steps[stepIndex - 1].id;

    checks._checkIsTargetStepId(targetStepId, { div, component, stepId, taskId, state, router, history });

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkIsNotCompletePage({ div, component, stepId, taskId, state, router, history }) {
    let { type } = TaskStore.get(taskId);
    if (type == null) { type = 'task'; }
    expect(div.querySelector(`.-${type}-completed`)).toBeNull();

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkIsCompletePage({ div, component, stepId, taskId, state, router, history }) {
    let { type } = TaskStore.get(taskId);
    if (type == null) { type = 'task'; }
    expect(div.querySelector(`.-${type}-completed`)).to.not.be.null;

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkIsDefaultStep({ div, component, stepId, taskId, state, router, history }) {
    const stepIndex = TaskStore.getCurrentStepIndex(taskId);
    const steps = TaskStore.getStepsIds(taskId);

    if (stepIndex === -1) { return checks._checkIsIntroScreen({ div, component, stepId, taskId, state, router, history }); }
    if (stepIndex === steps.length) { return checks._checkIsCompletePage({ div, component, stepId, taskId, state, router, history }); }

    const targetStepId = steps[stepIndex].id;

    checks._checkIsTargetStepId(targetStepId, { div, component, stepId, taskId, state, router, history });
    return { div, component, stepId, taskId, state, router, history };
  },

  _checkIsPopoverOpen({ div, component, stepId, taskId, state, router, history }) {
    expect(document.querySelector('.task-details-popover h1')).to.not.be.null;

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkAreAllStepsShowing({ div, component, stepId, taskId, state, router, history }) {
    const steps = TaskStore.getStepsIds(taskId);
    const stepNodes = div.querySelectorAll('.openstax-breadcrumbs-step');

    expect(stepNodes.length).toEqual(steps.length + 1);

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkEndReview({ div, component, stepId, taskId, state, router, history }) {
    const completedStepsInReview = div.querySelectorAll('.task-review-completed .task-step');
    const todoStepsInReview = div.querySelectorAll('.task-review-todo .task-step');

    const completedSteps = TaskStore.getCompletedSteps(taskId);
    const incompleteSteps = TaskStore.getIncompleteSteps(taskId);

    expect(completedStepsInReview.length).toEqual(completedSteps.length);
    expect(todoStepsInReview.length).toEqual(incompleteSteps.length);

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkHasAllBreadcrumbs({ div, component, stepId, taskId, state, router, history }) {
    const breadcrumbs = TestUtils.scryRenderedComponentsWithType(component, BreadcrumbTaskDynamic);
    const steps = TaskStore.getStepsIds(taskId);

    expect(breadcrumbs.length).toEqual(steps.length + 1);

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkHasReviewableBreadcrumbs({ div, component, stepId, taskId, state, router, history }) {
    let expectedCrumbs;
    const breadcrumbs = TestUtils.scryRenderedComponentsWithType(component, BreadcrumbTaskDynamic);
    const progress = TestUtils.scryRenderedComponentsWithType(component, ProgressBar);
    const completedSteps = TaskStore.getCompletedSteps(taskId);
    const steps = TaskStore.getSteps(taskId);
    const { type } = TaskStore.get(taskId);

    if (type === 'homework') { expectedCrumbs = steps.length + 1; }
    expect(breadcrumbs.length).toEqual(expectedCrumbs);

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkHasReadingProgressBar({ div, component, stepId, taskId, state, router, history }) {
    const progress = TestUtils.scryRenderedComponentsWithType(component, ProgressBar);
    const progressPanel = TestUtils.scryRenderedComponentsWithType(component, ProgressPanel);

    expect(progress.length).toEqual(1);
    expect(progressPanel.length).toEqual(1);

    return { div, component, stepId, taskId, state, router, history };
  },

  _checkHasExpectedGroupLabel({ div, component, stepId, taskId, state, router, history }) {
    const group = TestUtils.scryRenderedComponentsWithType(component, ExerciseGroup)[0];
    const step = TaskStepStore.get(stepId);

    if (step.group === 'personalized') {
      expect(group.getDOMNode().innerText).to.contain('Personalized');
    // TODO deprecate spaced practice when BE is updated
    } else if ((step.group === 'spaced_practice') || (step.group === 'spaced practice')) {
      expect(group.getDOMNode().innerText).to.contain('Spaced Practice');
    }

    return { div, component, stepId, taskId, state, router, history };
  },
};


// promisify for chainability in specs
ld.each(checks, function(check, checkName) {
  // rename without _ in front
  const promiseName = checkName.slice(1);

  return checks[promiseName] = (...args) => Promise.resolve(check(...Array.from(args || [])));
});

// These guys messed up the groove, maybe will change the way these work later
checks._checkIsMatchStep = function(stepIndex, { div, component, stepId, taskId, state, router, history }) {
  const steps = TaskStore.getStepsIds(taskId);
  const targetStepId = steps[stepIndex].id;
  checks._checkIsTargetStepId(targetStepId, { div, component, stepId, taskId, state, router, history });

  return { div, component, stepId, taskId, state, router, history };
};

checks.checkIsMatchStep = matchStepIndex =>
  (...args) => Promise.resolve(checks._checkIsMatchStep(matchStepIndex, ...Array.from(args)))
;

checks._checkIsPendingStep = function(stepIndex, { div, component, stepId, taskId, state, router, history }) {
  const breadcrumbs = TestUtils.scryRenderedComponentsWithType(component, BreadcrumbTaskDynamic);
  const placeholderBreadcrumb = breadcrumbs[stepIndex];

  const placeholderBreadcrumbDOM = placeholderBreadcrumb.getDOMNode();

  expect(placeholderBreadcrumbDOM.className).to.contain('placeholder');
  expect(div.querySelector('.task-step-personalized')).to.not.be.null;

  return { div, component, stepId, taskId, state, router, history };
};

checks.checkIsPendingStep = matchStepIndex =>
  (...args) => Promise.resolve(checks._checkIsPendingStep(matchStepIndex, ...Array.from(args)))
;


checks._checkIsNotPendingStep = function(stepIndex, ...args) {
  const { component } = args[0];
  let breadcrumbs = TestUtils.scryRenderedComponentsWithType(component, BreadcrumbTaskDynamic);
  breadcrumbs = TestUtils.scryRenderedComponentsWithType(component, BreadcrumbTaskDynamic);
  const placeholderBreadcrumb = breadcrumbs[stepIndex];

  const placeholderBreadcrumbDOM = placeholderBreadcrumb.getDOMNode();

  expect(placeholderBreadcrumbDOM.className).to.not.contain('placeholder');
  return checks._checkIsMatchStep(stepIndex, args[0]);
};

checks.checkIsNotPendingStep = matchStepIndex =>
  (...args) => Promise.resolve(checks._checkIsNotPendingStep(matchStepIndex, ...Array.from(args)))
;


checks._checkContinueButtonText = function(buttonText, ...args) {
  const { div } = args[0];
  const continueButton = div.querySelector('.continue');
  expect(continueButton.innerText).toEqual(buttonText);

  return args[0];
};

checks.checkContinueButtonText = buttonText =>
  (...args) => Promise.resolve(checks._checkContinueButtonText(buttonText, ...Array.from(args)))
;

checks._logStuff = function(logMessage, ...args) {
  const { div, stepId, taskId, router } = args[0];
  const step = TaskStepStore.get(stepId);

  console.info('logMessage', logMessage);

  if (router != null) {
    console.info('router.getCurrentPath', router.getCurrentPath());
    console.info('router.getCurrentParams', router.getCurrentParams());
  }

  console.info('step', step);
  console.info('div', div);

  return args[0];
};

checks.logStuff = logMessage =>
  (...args) => Promise.resolve(checks._logStuff(logMessage, ...Array.from(args)))
;

export default checks;
