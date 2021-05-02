import UX from '../../../src/screens/task/ux';
import { Milestones } from '../../../src/screens/task/milestones';
import { ApiMock, Factory, ld, runInAction, TestRouter, TimeMock } from '../../helpers';

describe('Reading Milestones Component', () => {
    let props, history;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');
    ApiMock.intercept({
        'steps': Factory.data('StudentTaskReadingStepContent'),
        'courses/\\d+/practice_questions': [],
    })
    beforeEach(() => {
        const task = Factory.studentTask({ type: 'reading', stepCount: 10 });
        props = {
            goToStep: jest.fn(),
            onHide: jest.fn(),
            ux: new UX({ task, course: Factory.course(), history }),
        };
        history = new TestRouter({
            push: (url) => {
                props.ux.goToStep(ld.last(url.split('/')), false);
            },
        }).history;
    });

    it('matches snapshot', () => {
        expect(<Milestones {...props} />).toMatchSnapshot();
    });

    it('goes to step', () => {
        const ms = mount(<Milestones {...props} />);
        ms.find('Breadcrumb[stepIndex=0]').simulate('click');
        expect(props.ux._stepId).toEqual(props.ux.steps[0].id);
        expect(props.onHide).toHaveBeenCalled();
        ms.unmount();
    });

    it('displays correct/incorrect', () => {
        props.ux.task.steps.forEach(s=>s.is_completed = true);
        expect(props.ux.milestoneSteps.length).toEqual(props.ux.steps.length);
        const step = props.ux.milestoneSteps.find(s => s.type === 'exercise');
        runInAction(() => {
            step.is_completed = true;
            step.answer_id = step.correct_answer_id = 1;
        })
        expect(step.isCorrect).toBe(true);

        const ms = mount(<Milestones {...props} />);
        expect(ms).toHaveRendered(`[data-step-id=${step.id}] .icon-correct`);
        expect(ms).not.toHaveRendered(`[data-step-id=${step.id}] .icon-incorrect`);

        runInAction(() => {
            step.answer_id = 1234;
        })
        expect(ms).toHaveRendered(`[data-step-id=${step.id}] .icon-incorrect`);
        expect(ms).not.toHaveRendered(`[data-step-id=${step.id}] .icon-correct`);

        ms.unmount();
    });

});
