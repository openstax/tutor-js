import { C } from '../../helpers';
import FreeTrialEnded from '../../../src/components/onboarding/free-trial-ended';
import { bootstrapCoursesList } from '../../courses-test-data';
import Course from '../../../src/models/course';
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

});
