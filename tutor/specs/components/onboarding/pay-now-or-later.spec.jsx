import { Wrapper, SnapShot } from 'helpers';
import PayNowOrLater from '../../../src/components/onboarding/pay-now-or-later';
import { STUDENT_COURSE_ONEldMODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';

describe('pay now or later modal', () => {
  let ux;
  beforeEach(() => {
    ux = new Student(new Course(STUDENT_COURSE_ONE_MODEL));
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(
      <Wrapper _wrapped_component={PayNowOrLater} ux={ux} />
    ).toMatchSnapshot();
  });

});
