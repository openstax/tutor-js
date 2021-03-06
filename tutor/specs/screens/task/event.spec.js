import UX from '../../../src/screens/task/ux';
import Event from '../../../src/screens/task/event';
import { Factory, C, TestRouter, TimeMock, ApiMock } from '../../helpers';

describe('Tasks External URL Screen', () => {
    let props;

    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    ApiMock.intercept({
        'steps': Factory.data('StudentTaskInteractiveStepContent'),
        'courses/\\d+/practice_questions': [],
    })

    beforeEach(() => {
        const task = Factory.studentTask({ type: 'event' });
        props = {
            ux: new UX({
                task, history: new TestRouter().history, course: Factory.course(),
            }),
        };
    });

    it('matches snapshot', () => {
        expect(<C><Event {...props} /></C>).toMatchSnapshot();
    });

});
