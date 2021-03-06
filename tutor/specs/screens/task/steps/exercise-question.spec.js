import ExerciseQuestion from '../../../../src/screens/task/step/exercise-question';
import { ApiMock, Factory, C, deferred } from '../../../helpers';
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

});
