import UX from '../../../src/screens/task/ux';
import Homework from '../../../src/screens/task/homework';
import { ApiMock, TestRouter, Factory, C, FakeWindow, ld, TimeMock, runInAction } from '../../helpers';

describe('Reading Tasks Screen', () => {
    let props, history;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    ApiMock.intercept({
        'tasks/\\d+': Factory.data('StudentTask'),
        'steps': Factory.data('StudentTaskExerciseStepContent'),
        'courses/\\d+/practice_questions': [],
    })

    function init(taskOptions = {}) {
        const course = Factory.course()
        const task = Factory.studentTask({
            type: 'homework', course, stepCount: 5, ...taskOptions,
        });

        history = new TestRouter({
            push: (url) => {
                const id = ld.last(url.split('/'));
                props.ux.goToStepId(id, false);
            },
        }).history;
        props = {
            windowImpl: new FakeWindow(),
            ux: new UX({ task, course: Factory.course(), history }),
        };
    }

    describe('Before close date', () => {
        beforeEach(() => {
            init()
        });

        it('matches snapshot', () => {
            expect(<C><Homework {...props} /></C>).toMatchSnapshot();
        });

        it('renders value props', () => {
            const h = mount(<C><Homework {...props} /></C>);
            expect(props.ux.currentStep.type).toEqual('instructions');
            props.ux.goForward();
            expect(props.ux.currentStep.type).toEqual('two-step-intro');
            expect(h).toHaveRendered('TwoStepValueProp');
            h.unmount();
        });

        it('renders task with placeholders', () => {
            runInAction(() => {
                props.ux.task.steps.forEach(s => s.type = 'placeholder');
            })
            const h = mount(<C><Homework {...props} /></C>);
            expect(h).toHaveRendered('Instructions');
            props.ux.goForward();
            expect(h).not.toHaveRendered('StepLockIcon');
            expect(h).toHaveRendered('IndividualReview');
            runInAction(() => {
                props.ux.isLocked = false;
                props.ux.goForward();
            })
            h.render();
            expect(h).toHaveRendered('LoadingCard');
            runInAction(() => {
                props.ux.currentStep.api.requestCounts.read = 1;
            })
            expect(h).toHaveRendered('PlaceHolderTaskStep');
            h.unmount();
        });
    });

    describe('After close date', () => {
        beforeEach(() => {
            init({ days_ago: 10 })
        });
  
        it('matches snapshot', () => {
            expect(<C><Homework {...props} /></C>).toMatchSnapshot();
        });
    })
});
