import GetAccess from '../../../src/components/navbar/student-get-access-btn';

import { bootstrapCoursesList } from '../../courses-test-data';
import Payments from '../../../src/models/payments';

jest.mock('../../../src/models/payments');

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
    const btn = shallow(<GetAccess courseId='1' />);
    expect(btn.text()).toContain('Free trial');
  });

  it('marks as paid when complete', () => {
    expect(course.userStudentRecord.is_paid).toBe(false);
    const btn = shallow(<GetAccess courseId='1' />);
    btn.instance().onComplete();
    expect(course.userStudentRecord.is_paid).toBe(true);
  });
});
