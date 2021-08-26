import ExerciseQuestion from '../../../../src/screens/task/step/exercise-question';
import { ApiMock, Factory, C, deferred, runInAction } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';
import { setFreeResponse } from '../helpers';

jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Free Response', () => {
    let props;

    ApiMock.intercept({
        'steps': () => Factory.bot.create('StudentTaskExerciseStepContent'),
        'courses/\\d+/practice_questions': [],
    })

    beforeEach(() => {
        const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
        const ux = new UX();
        ux.course = Factory.course();
        ux.questionNumberForStep = jest.fn(() => 42);
        props = { ux, step, question: step.content.questions[0] };
    });

    it('switches from free response to m/c', async () => {
        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        expect(eq).toHaveRendered('FreeResponseInput');
        props.ux.canUpdateCurrentStep = true
        await setFreeResponse(eq, { value: 'this is real answer' });
        return deferred(() => {
            expect(eq).not.toHaveRendered('FreeResponseInput');
            expect(eq).toHaveRendered('FreeResponseReview');
            expect(eq).toHaveRendered('AnswersTable');
            eq.unmount()
        })
    });

    it('renders exercise questions', async () => {
        props.ux.questionNumberForStep = jest.fn(() => 42);
        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        await setFreeResponse(eq, { value: 'this is real answer' });
        expect(eq).toHaveRendered('[data-question-number=42]');
        eq.unmount();
    });

    it('can answer question', async () => {
        const { step } = props;
        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        await setFreeResponse(eq, { value: 'this is real answer' });
        expect(props.ux.onFreeResponseComplete).toHaveBeenCalledWith(
            step, { wasModified: false },
        );
        eq.unmount();
    });

    it('shows MC when step cannot be updated', () => {
        props.step.can_be_updated = false;
        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        expect(eq).toHaveRendered('AnswersTable')
        eq.unmount();
    });

    xit('renders attempts left', async () => {
        const { step, ux } = props;

        ux.hasMultipleAttempts = true;
        step.answer_id = 1;
        step.can_be_updated = true;
        step.attempts_remaining = 1;
        ux._stepId = step.id;

        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        expect(eq.text()).toMatch('1 attempt left');
        runInAction(() => step.attempts_remaining = 0);
        expect(eq.text()).not.toMatch('0 attempts left');
        eq.unmount();
    });

    it('renders possible points', async () => {
        props.step.published_points_without_lateness = null;
        props.step.available_points = 2.0

        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        expect(eq.text()).toMatch('Points: 2.0');
        eq.unmount();
    });

    it('renders graded points', async () => {
        const { step } = props;
        step.can_be_updated = false;
        step.published_points_without_lateness = 1.0;
        step.published_points = 1.0;
        step.available_points = 2.0;

        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        expect(eq.text()).toMatch('Points: 1.0 / 2.0');
        eq.unmount();
    });

    it('renders detailed solution', async () => {
        const solutionText = 'Some detailed solution text';
        const { step } = props;

        step.can_be_updated = false;
        step.solution = { content_html: solutionText };

        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        expect(eq.find('.points').text()).toMatch (`Detailed solution: ${solutionText}`);
        eq.unmount();
    });

    it('renders grading feedback/comments', async () => {
        const comments = 'Grading comments about the assignment.';
        const { step } = props;
        step.can_be_updated = false;
        step.published_comments = comments;

        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        expect(eq.find('.points').text()).toMatch (`Feedback: ${comments}`);
        eq.unmount();
    });

    xit('renders contextual submit button text', async () => {
        const { step } = props;
        const eq = mount(<C><ExerciseQuestion {...props} /></C>);
        props.ux.canUpdateCurrentStep = true
        await setFreeResponse(eq, { value: 'this is real answer' });
        return deferred(() => {
            expect(eq.find('.btn[data-test-id="submit-answer-btn"]').text()).toMatch('Submit');
            runInAction(() => step.attempt_number = 1);
            expect(eq.find('.btn[data-test-id="submit-answer-btn"]').text()).toMatch('Re-submit');
            eq.unmount();
        });

    });
});
