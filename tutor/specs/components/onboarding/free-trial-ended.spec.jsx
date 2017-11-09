import { Wrapper, SnapShot } from '../helpers/component-testing';
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
    expect(SnapShot.create(
      <Wrapper _wrapped_component={FreeTrialEnded} ux={ux} />).toJSON()
    ).toMatchSnapshot();
    courses.clear();
    expect(SnapShot.create(
      <Wrapper _wrapped_component={FreeTrialEnded} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

});
