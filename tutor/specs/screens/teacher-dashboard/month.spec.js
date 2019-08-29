import moment from 'moment';
import { C } from '../../helpers';
import Month from '../../../src/screens/teacher-dashboard/month';
import Factory from '../../factories';
import TimeHelper from '../../../src/helpers/time';

describe('CourseCalendar Month display', () => {
  let course;
  let props = {};

  beforeEach(() => {
    course = Factory.course({ is_teacher: true });
    Factory.teacherTaskPlans({ course });
    props = {
      date: course.teacherTaskPlans.array[0].duration.end,
      course: course,
      onDrop: jest.fn(),
      onDrag: jest.fn(),
      termEnd: moment().add(2, 'month'),
      termStart: moment().subtract(3, 'month'),
      onDayClick: jest.fn(),
      dateFormat: TimeHelper.ISO_DATE_FORMAT,
      hasPeriods: true,
      showingSideBar: true,
    };
  });

  it('renders plans', function() {
    const m = mount(<C><Month {...props} /></C>);
    const taskPlan = course.teacherTaskPlans.array[0];
    expect(m).toHaveRendered(`[data-plan-id="${taskPlan.id}"]`);
    m.unmount();
  });

});
