import { Wrapper, SnapShot } from '../helpers/component-testing';
import FreeTrialActivated from '../../../src/components/onboarding/free-trial-activated';
import { STUDENT_COURSE_ONE_MODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';

describe('Free trial ended modal', () => {
  let ux;
  beforeEach(() => {
    ux = new Student(new Course(STUDENT_COURSE_ONE_MODEL));
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={FreeTrialActivated} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

});
