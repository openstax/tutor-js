import steps from './steps';

import omit from 'lodash/omit';
import extend from 'lodash/extend';
import clone from 'lodash/clone';
import forEach from 'lodash/forEach';

const stepsStubs = {};

const TASK_ID = '40';
const commonInfo = {
    content_url: 'https://exercises-dev.openstax.org/exercises/120@1',
    group: 'core',

    related_content: [{
        title: 'Physics is cool, yo',
        chapter_section: '1.3',
    }],

    task_id: TASK_ID,
};

// stem and stimulus here as well to replicate real JSON
const commonContent = {
    stimulus_html: 'This stim should only show up once.',
    stem_html: 'This stem should only show up once.',
    uid: '120@1',
};

const assignStepToTask = function(step, stepIndex) {
    step.content = extend({}, commonContent, step.content);
    return extend({ questionNumber: (stepIndex + 1) }, { stepIndex }, commonInfo, step);
};


forEach(steps, function(step, stepIndex) {
    const stepStubs = {
        'free-response': assignStepToTask(omit(step, 'correct_answer_id', 'feedback_html'), stepIndex),
        'multiple-choice': assignStepToTask(omit(step, 'correct_answer_id', 'feedback_html'), stepIndex),
        'review': assignStepToTask(clone(step), stepIndex),
    };

    return stepsStubs[step.id] = stepStubs;
});

export default stepsStubs;
