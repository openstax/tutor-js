import { Wrapper, SnapShot } from '../helpers/component-testing';
import PayNowOrLater from '../../../src/components/onboarding/pay-now-or-later';
import { STUDENT_COURSE_ONE_MODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';

describe('pay now or later modal', () => {
  let ux;
  beforeEach(() => {
    ux = new Student(new Course(STUDENT_COURSE_ONE_MODEL));
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={PayNowOrLater} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

});
