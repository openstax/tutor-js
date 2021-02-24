import { TaskInfo } from '../../../src/screens/task/task-info';
import { Factory, TimeMock } from '../../helpers';

describe('Tasks Info', () => {
    let props;

    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        const task = Factory.studentTask({ stepCount: 1, type: 'reading' });
        props = { task };
    });

    it('matches snapshot', () => {
        expect(<TaskInfo {...props} />).toMatchSnapshot();
    });

    it('hides due date if task has none', () => {
        props.task.due_at = null;
        const taskInfo = mount(<TaskInfo {...props} />);
        expect(taskInfo).not.toHaveRendered('DueDate');
        taskInfo.unmount();
    });

});
