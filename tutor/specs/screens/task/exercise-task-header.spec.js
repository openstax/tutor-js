import UX from '../../../src/screens/task/ux';
import ExerciseTaskHeader from '../../../src/screens/task/exercise-task-header';
import { Factory, C, TestRouter, TimeMock, ApiMock } from '../../helpers';

describe('Homework ExerciseTaskHeader Component', () => {
    let props;
    let task;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    ApiMock.intercept({
        'steps': () => task.steps[0].toJSON(),
        'courses/\\d+/practice_questions': [],
    })

    beforeEach(() => {
        task = Factory.studentTasks({
            count: 1,
            attributes: { type: 'homework' },
        }).array[0];

        props = {
            unDocked: true,
            goToStep: jest.fn(),
            ux: new UX({
                task,
                stepId: task.steps[0].id,
                history: new TestRouter().history,
            }),
        };
    });

    it('matches snapshot', () => {
        expect(<ExerciseTaskHeader {...props} />).toMatchSnapshot();
    });

    it('goes to step', () => {
        const { ux } = props;
        jest.spyOn(props.ux.history, 'push');
        const ms = mount(<C><ExerciseTaskHeader {...props} /></C>);
        ms.find('.sticky-table-row').at(0).find('.sticky-table-cell').at(1).simulate('click');
        expect(ux.history.push).toHaveBeenCalledWith(`/course/${task.tasksMap.course.id}/task/${task.id}/step/instructions`);
        ms.unmount();
    });

});
