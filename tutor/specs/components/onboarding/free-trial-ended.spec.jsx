import { Wrapper, SnapShot } from 'helpers';
import FreeTrialEnded from '../../../src/components/onboarding/free-trial-ended';
import { bootstrapCoursesList } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';

describe('Free trial ended modal', () => {
  let ux;
  let courses;
  beforeEach(() => {
    courses = bootstrapCoursesList();
    ux = new Student(courses.get(1));
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(
      <Wrapper _wrapped_component={FreeTrialEnded} ux={ux} />
    ).toMatchSnapshot();
    courses.clear();
    expect.snapshot(
      <Wrapper _wrapped_component={FreeTrialEnded} ux={ux} />
    ).toMatchSnapshot();
  });

});
