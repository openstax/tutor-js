import { React, Wrapper, SnapShot } from '../../helpers';
import { map } from 'lodash';
import Factory from '../../factories';
import PastAssignments from '../../../src/screens/teacher-dashboard/past-assignments';


describe('CourseCalendar Past Assignments listing', function() {
  let course;
  let props = {};

  beforeEach(function() {
    course = Factory.course({ is_teacher: true, cloned_from_id: 1 });
    Factory.pastTaskPlans({ course });
    props = {
      course,
      cloningPlanId: '',
    };
  });

  it('lists plans in due date order', function() {
    expect(course.isCloned).toBe(true);
    const wrapper = mount(<Wrapper _wrapped_component={PastAssignments} {...props} />);
    const ids = wrapper.find('[data-assignment-id]').map(d => Number(d.props()['data-assignment-id']));
    expect(ids).toEqual(map(course.pastTaskPlans.array, 'id'));
  });
});
