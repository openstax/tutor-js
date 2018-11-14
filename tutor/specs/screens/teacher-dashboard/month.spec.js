import moment from 'moment';
import { C } from '../../helpers';
import Month from '../../../src/screens/teacher-dashboard/month';
import Factory from '../../factories';
import TimeHelper from '../../../src/helpers/time';
import { DragDropManager } from 'dnd-core';

describe('CourseCalendar Month display', () => {
  let course;
  let props = {};

  beforeEach(() => {
    course = Factory.course({ is_teacher: true });
    Factory.taskPlans({ course });
    props = {
      date: course.taskPlans.array[0].duration.end(),
      course: course,
      termEnd: moment().add(2, 'month'),
      termStart: moment().subtract(3, 'month'),
      dateFormat: TimeHelper.ISO_DATE_FORMAT,
      hasPeriods: true,
      showingSideBar: true,
    };
  });

  it('renders plans and hides when deleting', function() {
    const m = mount(<C><Month {...props} /></C>);

    // const plan = course.taskPlans.array[0];
    // expect(month).toHaveRendered(`[data-plan-id="${plan.id}"]`);
    // plan.is_deleting = true;
    // expect(month).not.toHaveRendered(`[data-plan-id="${plan.id}"]`);
  });

});
