import _ from 'underscore';

import policies from './policies';
import { TaskStore } from '../../flux/task';
import { currentCourses } from '../../models';
import Router from '../router';
const DEFAULT = 'default';

const utils = {
    _dueState(task) {
        let state = 'before';
        if (task.is_feedback_available || ((task.due_at != null) && TaskStore.isTaskPastDue(task.id))) { state = 'after'; }

        return state;
    },

    _role() {
        const { courseId } = Router.currentParams();
        const course = currentCourses.get(courseId);
        if (course) { return course.primaryRole.type; } else { return 'unknown'; }
    },

    _checkQuestionFormat(task, step, panel) {
    // assuming 1 question right now
        const question = step.content.questions[0];

        let { aliases } = panel;
        if (aliases == null) { aliases = []; }
        aliases.push(panel.name);

        // change for matches with panel name or aliases
        return !_.isEmpty(_.intersection(question.formats, aliases));
    },

    _getCheckedPolicy(task, step, possiblePolicies) {
        const checkFn = `_${possiblePolicies.check}`;
        const state = utils[checkFn](task, step);

        return possiblePolicies.states[state];
    },

    _getPolicy(task, step, policyFor) {

        let policy;
        let taskType = task.type;
        if (policies[taskType] == null) {
            const warning = `${taskType} policy is missing. \
Please check src/helpers/policies/policies file. \
Default ${policyFor} policy for ${step.type} being used.`;
            // eslint-disable-next-line
      console.warn(warning);
            taskType = DEFAULT;
        }

        const possiblePolicies = policies[taskType][step.type][policyFor];

        if (possiblePolicies.default != null) { policy = possiblePolicies.default; }

        if (possiblePolicies.check) {
            const checkedPolicy = utils._getCheckedPolicy(task, step, possiblePolicies);
            if (checkedPolicy != null) { policy = checkedPolicy; }
        }

        if (policy.check) {
            const nestedCheckedPolicy = utils._getCheckedPolicy(task, step, policy);
            if (nestedCheckedPolicy != null) { policy = nestedCheckedPolicy; }
        }

        return policy;
    },

    _isCardPassed(step, checks) {
        const panelPassed = _.reduce(checks, (memo, next) => (
            // needs to detect both if the property next exists and if the value is truthy
            memo && (step[next] != null) && step[next]
        ), true);

        return panelPassed;
    },

    _getCards(task, step) {
        const allCards = utils._getPolicy(task, step, 'panels');

        // get a list of panels need for question
        const panels = _.filter(allCards, function(panel) {
            if (!panel.optional) { return true; }

            const optionalFn = `_${panel.optional}`;
            return utils[optionalFn](task, step, panel);
        });

        return panels;
    },

    _areCardsPassed(task, step, panels) {
        return _.map(panels, function(panel) {
            panel.passed = false;
            if (panel.passCheck != null) { panel.passed = utils._isCardPassed(step, panel.passCheck); }
            return panel;
        });
    },

    _getCard(panelsWithStatus) {
        let panel = _.findWhere(panelsWithStatus, { passed: false });

        return panel != null ? panel : (panel = _.last(panelsWithStatus));
    },

    _canReview(panels) {
        const reviewCard = _.findWhere(panels, { canReview: true });
        return (reviewCard != null);
    },

    _canWrite(panels) {
        const cannotWrite = _.findWhere(panels, { canWrite: false });
        return (cannotWrite == null);
    },
};

export default utils;
