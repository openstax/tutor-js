import { Wrapper, SnapShot } from '../helpers/component-testing';
import MakePayment from '../../../src/components/onboarding/make-payment';
import { STUDENT_COURSE_ONE_MODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import Student from '../../../src/models/course/onboarding/student-course';
import { isFunction } from 'lodash';

describe('make payment modal', () => {
  let ux;
  beforeEach(() => {
    ux = new Student(new Course(STUDENT_COURSE_ONE_MODEL));
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={MakePayment} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

  it('calls onCancel', () => {
    const modal = shallow(<MakePayment ux={ux} />);
    const payments = modal.find('PaymentsPanel');
    const onCancel = payments.props().onCancel;
    expect(onCancel).toBe(ux.onPayLater);
    expect(isFunction(onCancel)).toBe(true);
  });
});
