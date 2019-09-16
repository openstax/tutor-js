import { React, R } from '../../helpers';
import { last } from 'lodash';
import Factory from '../../factories';
import { Provider } from 'mobx-react';
import PlanDetails from '../../../src/screens/teacher-dashboard/plan-details';
import TourContext from '../../../src/models/tour/context';

const renderModal = props =>
  new Promise( function(resolve) {
    const planDetails = <R><Provider tourContext={new TourContext()}>
      <PlanDetails {...props} />
    </Provider></R>;
    const wrapper = mount(planDetails);
    resolve(last(document.querySelectorAll('.modal')));
    wrapper.unmount();
  })
;

describe('Plan Details Component', function() {

  let props;
  let plan;
  let course;

  beforeEach(() => {
    course = Factory.course({ is_teacher: true });
    Factory.teacherTaskPlans({ course });
    plan = course.teacherTaskPlans.array[0];

    props = {
      plan,
      course,
      onHide: jest.fn(),
    };
  });

  it('renders no students enrolled', () => {
    plan.is_published = true;
    course.periods[0].num_enrolled_students = 0;
    return renderModal(props).then((m) => {
      expect(m.textContent).toContain('No students enrolled');
    });
  });

  it('renders w/out lms links for events', () => {
    plan.is_published = true;
    plan.type = 'event';
    return renderModal(props).then((m) => {
      expect(m.textContent).toContain('Edit Event');
      expect(m.textContent).not.toContain('assignment link');
    });
  });

});
