import Task from '../../../src/screens/task/index';
import { C, Factory } from '../../helpers';
import { observable } from 'mobx';
jest.mock('../../../src/models/student-tasks/task');

describe('Tasks Screen', () => {
  let props;
  let task;

  beforeEach(() => {
    const course = Factory.course();
    task = course.studentTasks.get(1);
    Object.assign(task, {
      id: 1,
      type: 'reading',
      tasksMap: { course },
      api: observable({
        hasErrors: false,
        isPendingInitialFetch: true,
      }),
    });

    props = {
      course,
      params: {
        courseId: course.id,
        id: task.id,
      },
    };
  });

  it('renders and fetches', () => {
    const t = mount(<C><Task {...props} /></C>);
    expect(task.fetch).toHaveBeenCalled();
    expect(t).toHaveRendered('ContentLoader');
    t.unmount();
  });

});
