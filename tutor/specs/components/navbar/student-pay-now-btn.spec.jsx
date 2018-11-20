import { Factory } from '../../helpers';
import GetAccess from '../../../src/components/navbar/student-pay-now-btn';

import { bootstrapCoursesList } from '../../courses-test-data';
import Payments from '../../../src/models/payments';

jest.mock('../../../src/models/payments');
jest.mock('../../../src/models/course');

jest.mock('../../../src/flux/time', () => ({
  TimeStore: {
    getNow: () => new Date('2017-07-01'),
  },
}));

describe('Student get access button', function() {
  let props;
  beforeEach(() => {
    props = {
      course: Factory.course(),
    };
  });

  it('does not render if course if free', () => {
    props.course.does_cost = false;
    const btn = shallow(<GetAccess {...props} />);
    expect(btn.html()).toBeNull();
  });

  it('renders trial message when payments is disabled', () => {
    Payments.config.is_enabled = false;
    props.course.isInTrialPeriod = true;
    const btn = shallow(<GetAccess {...props} />);
    expect(btn.text()).toContain('Free trial');
  });

  it('marks as paid when complete', () => {
    props.course.userStudentRecord = { is_paid: false, markPaid: jest.fn() };
    const btn = shallow(<GetAccess {...props} />);
    btn.instance().onComplete();
    expect(props.course.userStudentRecord.markPaid).toHaveBeenCalled();
  });

  it('hides and does not mark as paid when complete', () => {
    props.course.needsPayment = true;
    props.course.userStudentRecord = { trialTimeRemaining: '1 day', markPaid: jest.fn() };
    const btn = mount(<GetAccess {...props} />);
    btn.find('Button').simulate('click');
    expect(btn).toHaveRendered('PaymentsModal');
    btn.instance().onCancel();
    expect(btn).not.toHaveRendered('PaymentsModal');
    expect(props.course.userStudentRecord.markPaid).not.toHaveBeenCalled();
  });

});
