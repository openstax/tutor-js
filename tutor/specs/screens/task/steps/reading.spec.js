import Reading from '../../../../src/screens/task/step/reading';
import { ApiMock, Factory, FakeWindow, TestRouter, TimeMock, C } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

jest.mock('../../../../src/components/book-page', () => (({ children }) =>
    <div>{children}</div>
));

describe('Reading Tasks Screen', () => {
    let props;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');
    ApiMock.intercept({
        'steps': () => Factory.bot.create('StudentTaskExerciseStepContent'),
        'courses/\\d+/practice_questions': [],
    })

    beforeEach(() => {
        const task = Factory.studentTask({
            type: 'reading', stepCount: 1,
            steps: [ { type: 'reading' } ],
        });
        const ux = new UX({
            task,
            course: Factory.course(),
            history: new TestRouter().history,
        });
        props = {
            ux,
            step: task.steps[0],
            windowImpl: new FakeWindow,
        };
    });


    it('matches snapshot', () => {
        expect.snapshot(<C><Reading {...props} /></C>).toMatchSnapshot();
    });

});
