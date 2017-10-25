import { React, ReactTestUtils } from '../helpers/component-testing';
import { last } from 'lodash';
import { ReactWrapper } from 'enzyme';
import PlanDetails from '../../../src/components/course-calendar/plan-details';
import COURSE from '../../../api/courses/1.json';
import PLANS from '../../../api/courses/1/dashboard.json';
import TaskPlan from '../../../src/models/task-plan/teacher';
import Courses from '../../../src/models/courses-map';
import EnzymeContext from '../helpers/enzyme-context';

const COURSE_ID = '1';

const renderModal = props =>
  new Promise( function(resolve) {
    const wrapper = mount(<PlanDetails {...props} />, EnzymeContext.build());
    resolve(last(document.querySelectorAll('.modal')));
    wrapper.unmount();
  })
;

describe('Plan Details Component', function() {

  let props;
  let plan;

  beforeEach(() => {
    plan = new TaskPlan(PLANS.plans[0]);
    Courses.bootstrap([COURSE], { clear: true });
    props = {
      plan,
      courseId: COURSE_ID,
      onHide: jest.fn(),
    };
  });

  it('renders no students enrolled', () => {
    plan.is_published = true;
    return renderModal(props).then((m) => {
      expect(m.textContent).toContain('No students enrolled');
    });
  });

  it('renders w/out lms links for events', () => {
    plan.is_published = true;
    plan.type = 'event';
    return renderModal(props).then((m) => {
      expect(m.textContent).toContain('View Event');
      expect(m.textContent).not.toContain('assignment link');
    });
  });

});
