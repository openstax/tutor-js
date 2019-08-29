import { C } from '../../helpers';
import FreeTrialEnded from '../../../src/components/onboarding/free-trial-ended';
import { bootstrapCoursesList } from '../../courses-test-data';
import Student from '../../../src/models/course/onboarding/student-course';

describe('Free trial ended modal', () => {
  let props;
  let courses;
  beforeEach(() => {
    courses = bootstrapCoursesList();
    props = {
      ux: new Student(courses.get(1)),
      onDismiss: jest.fn(),
    };
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(<C><FreeTrialEnded {...props} /></C>).toMatchSnapshot();
    courses.clear();
    expect.snapshot(<C><FreeTrialEnded {...props} /></C>).toMatchSnapshot();
  });

  it('does not ask for payments on old courses', () => {
    expect(props.ux.course.hasEnded).toBe(false);
    const modal = mount(<C><FreeTrialEnded {...props} /></C>);
    expect(modal.text()).toContain('Buy access');

    props.ux.course.ends_at = (new Date() - 10000);
    expect(props.ux.course.hasEnded).toBe(true);
    expect(modal.text()).not.toContain('Buy access');
    modal.unmount();
  });
});
