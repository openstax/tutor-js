import Task from '../../../src/screens/task/index';
import { C, Factory } from '../../helpers';
import { observable } from 'mobx';
jest.mock('../../../src/models/student-tasks/task');

describe('Tasks Screen', () => {
  let props;
  let course;
  let task;

  beforeEach(() => {
    course = Factory.course();
    task = course.studentTasks.get(1);
    Object.assign(task, {
      id: 1,
      type: 'reading',
      isLoaded: true,
      tasksMap: { course },
      api: observable({
        hasErrors: false,
        hasBeenFetched: true,
      }),
      steps: [ { id: 1 } ],
    });

    props = {
      course,
      params: {
        courseId: course.id,
        id: task.id,
      },
    };
  });

  it('redirects to first step', () => {
    const t = mount(<C><Task {...props} /></C>);
    expect(t).toHaveRendered(`Redirect[push=false][to="/course/${course.id}/task/${task.id}/step/1"]`);
    t.unmount();
  });

  it('renders and fetches', () => {
    task.isLoaded = false;
    task.api.isFetchedOrFetching = false;
    task.api.isPending = true;
    task.api.hasBeenFetched = false;
    const t = mount(<C><Task {...props} /></C>);
    expect(task.load).toHaveBeenCalled();
    expect(t).toHaveRendered('ContentLoader');
    t.unmount();
  });

});
