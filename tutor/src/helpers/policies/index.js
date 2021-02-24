// policies describes the following situations.
// This should handle the 4 different states an Exercise can be in:
// 1. `not(free_response)`: Show the question stem and a text area
// 2. `free_response and not(is_completed)`: Show stem, your free_response, and the multiple choice options
// 3. `correct_answer`: review how you did and show feedback (if any)
// 4. `task.is_completed and answer` show your answer choice but no option to change it

// This should also handle when an Exercise format is a True-False:
// 5.  `question.formats` does not have 'free-response' and not(is_completed): Show stem and true-false options
// 6.  `question.formats` does not have 'free-response' and `correct_answer`: review how you did and show feedback (if any)

// Also, also, also, this should handle with an exercise is part of a homework
// 7. Before due -- does not show feedback and moves on to the next question on question finish
// 8. After due -- does show feedback before moving on

import _ from 'underscore';

import { TaskStepStore } from '../../flux/task-step';
import { TaskStore } from '../../flux/task';

import utils from './utils';

const defaultTask =
  { type: 'default' };

const defaultStep =
  { type: 'placeholder' };

const getTaskStepCards = function(stepId) {
    let step = TaskStepStore.get(stepId);
    if (step == null) { step = defaultStep; }

    let task = TaskStore.get(step.task_id);
    if (task == null) { task = defaultTask; }

    const panels = utils._getCards(task, step);
    return { panels, step, task };
};

const getCardsWithStatus = function(stepId) {
    const { task, step, panels } = getTaskStepCards(stepId);
    return utils._areCardsPassed(task, step, panels);
};


const StepCard = {
    getCardsWithStatus,

    getCard(stepId) {
        const panelsWithStatus = getCardsWithStatus(stepId);
        const panel = utils._getCard(panelsWithStatus);

        return panel.name;
    },

    getRemainingActions(stepId) {
        const panelsWithStatus = getCardsWithStatus(stepId);
        const remainingCards = _.where(panelsWithStatus, { passed: false });

        return _.chain(remainingCards).pluck('actions').flatten().value();
    },

    canReview(stepId) {
        const { panels } = getTaskStepCards(stepId);
        return utils._canReview(panels);
    },

    canWrite(stepId) {
        const { panels } = getTaskStepCards(stepId);
        return utils._canWrite(panels);
    },

    canForward(stepId) {
        return StepCard.canContinue(stepId) && _.isEqual(StepCard.getRemainingActions(stepId), ['clickContinue']);
    },

    canContinue(stepId) {
        const step = TaskStepStore.get(stepId);
        // if step is falsy, this step is a placeholder step and
        // can be continued from
        if (step == null) { return true; }

        const mostCurrentStep = TaskStore.getCurrentStep(step.task_id);
        const isMostCurrentStep = (mostCurrentStep != null) && (step.id === mostCurrentStep.id);

        // Steps can be continued if it's writable.
        // If it's not writable and the most current step,
        // then you cannot continue.
        return this.canWrite(stepId) || !isMostCurrentStep;
    },
};

export { StepCard, utils };
