import End from '../../../../src/screens/task/step/end';
import { ApiMock, Factory, TestRouter, C, TimeMock, runInAction } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

describe('Tasks Ending Screen', () => {
    let props;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    ApiMock.intercept({
        'steps': () => Factory.bot.create('StudentTaskExerciseStepContent'),
        'courses/\\d+/practice_questions': [],
    })

    beforeEach(() => {
        const task = Factory.studentTask({ type: 'homework', stepCount: 2 });
        const ux = new UX({
            task,
            course: Factory.course(),
            history: new TestRouter().history,
        });
        props = { ux };
    });

    it('not started state', () => {
        props.ux.task.steps.forEach(s => s.is_completed = false);
        const en = mount(<C noRef><End {...props} /></C>);
        expect(en.text()).toContain('No steps have been completed');
        en.unmount();
        expect.snapshot(<C noRef><End {...props} /></C>).toMatchSnapshot();
    });

    it('partial state', () => {
        props.ux.task.steps[0].is_completed = true;
        props.ux.task.steps[1].is_completed = false;
        const en = mount(<C noRef><End {...props} /></C>);
        expect(en.text()).toContain('Assignment is partially complete');
        expect(en.text()).toContain('completed 1 of 2 steps');
        en.unmount();
        expect.snapshot(<C noRef><End {...props} /></C>).toMatchSnapshot();
    });

    it('completed state', () => {
        props.ux.task.steps.forEach(s => s.is_completed = true);
        const en = mount(<C noRef><End {...props} /></C>);
        expect(en.text()).toContain('Great job');
        en.unmount();
        expect.snapshot(<C noRef><End {...props} /></C>).toMatchSnapshot();
        runInAction(() => {
            props.ux.task.type = 'reading';
        })
        expect.snapshot(<C noRef><End {...props} /></C>).toMatchSnapshot();
    });

});
