import { Wrapper, SnapShot } from 'helpers';
import MakePayment from '../../../src/components/onboarding/make-payment';
import { STUDENT_COURSE_ONEldMODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';
import { isFunction } from 'lodash';

describe('make payment modal', () => {
  let ux;
  beforeEach(() => {
    ux = new Student(new Course(STUDENT_COURSE_ONE_MODEL));
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(
      <Wrapper _wrapped_component={MakePayment} ux={ux} />
    ).toMatchSnapshot();
  });

  it('calls onCancel', async () => {
    const wrapper = shallow(<MakePayment ux={ux} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    const payments = wrapper.find('PaymentsPanel');
    const onCancel = payments.props().onCancel;
    expect(onCancel).toBe(ux.onPayLater);
    expect(isFunction(onCancel)).toBe(true);
  });
});
