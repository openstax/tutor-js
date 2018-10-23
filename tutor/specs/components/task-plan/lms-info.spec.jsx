import { SnapShot, Wrapper } from '../helpers/component-testing';
import TaskPlan from '../../../src/models/task-plan/teacher';

import LmsInfo from '../../../src/components/task-plan/lms-info';
import { bootstrapCoursesList } from '../../courses-test-data';

//jest.mock('../../../src/models/task-plan/teacher')

describe('LmsInfo Component', function() {
  let props;
  let courses;

  beforeEach(function() {
    courses = bootstrapCoursesList();
    props = {
      courseId: '1',
      onBack: jest.fn(),
      plan: new TaskPlan({
        id: '2',
        title: 'A test plan',
        description: '',
        shareable_url: '/foo/a-test-plan',
        tasking_plans: [{
          opens_at: '2012-01-01',
          due_at: '2012-02-01',
        }],
      }),
    };
  });

  it('renders NO LINK when preview course', async () => {
    courses.get(props.courseId).is_preview = true;
    const wrapper = mount(<LmsInfo {...props} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(wrapper).toHaveRendered('.lms-info.preview');
  });

  it('renders with message even when there is no url', async function() {
    props.plan.analytics.shareable_url = '';
    const wrapper = mount(<LmsInfo {...props} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(wrapper.html()).not.toBeNull();
  });

  it('matches snapshot', () => {
    expect(
      SnapShot.create(
        <LmsInfo {...props} />
      ).toJSON()
    ).toMatchSnapshot();
  });


});
