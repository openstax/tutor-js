import { Factory, C } from '../../../helpers';
import Instructions from '../../../../src/screens/task/step/instructions';

describe('Instructions', () => {
    let task;
    let props;

    beforeEach(() => {
        task = Factory.studentTask({
            type: 'homework',
            stepCount: 1,
            due_at: '20210816T200000Z',
            closes_at: '20210823T200000Z',
        });
        const ux = { canGoForward: true, goForward: jest.fn(), goToStepId: jest.fn(), task: task };
        props = { ux };
    });

    it('renders the assignment instructions for immediate feedback', () => {
        task.auto_grading_feedback_on = 'answer';
        task.manual_grading_feedback_on = 'grade';
        expect.snapshot(<C><Instructions {...props} /></C>).toMatchSnapshot();
    });

    it('renders the assignment instructions for feedback when due', () => {
        task.auto_grading_feedback_on = 'due';
        task.manual_grading_feedback_on = 'grade';
        expect.snapshot(<C><Instructions {...props} /></C>).toMatchSnapshot();
    });

    it('renders the assignment instructions for feedback when published', () => {
        task.auto_grading_feedback_on = 'publish';
        task.manual_grading_feedback_on = 'publish';
        expect.snapshot(<C><Instructions {...props} /></C>).toMatchSnapshot();
    });
});
