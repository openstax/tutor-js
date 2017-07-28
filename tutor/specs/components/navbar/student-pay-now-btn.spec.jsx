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

  let course;
  beforeEach(() => {
    course = bootstrapCoursesList().get('1');
  });

  it('does not render if course if free', () => {
    course.does_cost = false;
    const btn = shallow(<GetAccess courseId='1' />);
    expect(btn.html()).toBeNull();
  });

  it('renders trial message when payments is disabled', () => {
    Payments.config.is_enabled = false;
    course.isInTrialPeriod = true;
    const btn = shallow(<GetAccess courseId='1' />);
    expect(btn.text()).toContain('Free trial');
  });

  it('marks as paid when complete', () => {
    course.userStudentRecord = { is_paid: false, markPaid: jest.fn() };
    const btn = shallow(<GetAccess courseId='1' />);
    btn.instance().onComplete();
    expect(course.userStudentRecord.markPaid).toHaveBeenCalled();
  });
});
