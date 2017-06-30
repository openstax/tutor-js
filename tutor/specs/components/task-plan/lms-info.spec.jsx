jest.mock('../../../src/flux/task-plan-stats');

import { LmsInfoLink } from '../../../src/components/task-plan/lms-info';
import { bootstrapCoursesList } from '../../courses-test-data';
import TaskPlanStore from '../../../src/flux/task-plan-stats';

describe('LmsInfo Component', function() {
  let props;
  let courses;

  beforeEach(function() {
    courses = bootstrapCoursesList();
    props = {
      courseId: '1',
      plan: {
        id: '2',
        title: 'A test plan',
        description: '',
        shareable_url: '/foo/a-test-plan',
      },
    };
  });

  it('renders NO LINK when preview course', () => {
    TaskPlanStore.TaskPlanStatsStore.get.mockReturnValueOnce({ shareable_url: 'foo' });
    courses.get(props.courseId).is_preview = true;
    const info = mount(<LmsInfoLink {...props} />);
    info.find('.get-link').simulate('click');
    expect(document.querySelector('.popover-title').textContent).toContain('No assignment link');
    info.unmount();
  });

  it('renders with message even when there is no url', function() {
    TaskPlanStore.TaskPlanStatsStore.get.mockReturnValueOnce({});
    props.plan.shareable_url = '';
    const info = mount(<LmsInfoLink {...props} />);
    expect(info.html()).not.toBeNull();
    info.unmount();
  });

  it('renders with stats', () => {
    TaskPlanStore.TaskPlanStatsStore.get.mockReturnValueOnce({ shareable_url: 'foo' });
    const info = shallow(<LmsInfoLink {...props} />);
    expect(info).toHaveRendered('.get-link');
    info.unmount();
  });

  it('displays popover when clicked', () => {
    TaskPlanStore.TaskPlanStatsStore.get.mockReturnValue({ shareable_url: 'foo' });
    const info = mount(<LmsInfoLink {...props} />);
    info.find('.get-link').simulate('click');
    expect(document.querySelector('.body input').value).toContain('foo');
    info.unmount();
  });
});
