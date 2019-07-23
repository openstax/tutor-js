import Tasking from '../../../../src/screens/assignment-builder/builder/tasking';
import UX from '../../../../src/screens/assignment-builder/ux';
import { Factory, TimeMock, moment } from '../../../helpers';


describe('Tasking Builder', () => {

  let props, plan, course;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    course = Factory.course();
    plan = Factory.teacherTaskPlan({ course });
    const ux = new UX({ course, plan });
    props = { ux };
  });

  it('sets times', function() {
    const tasking = mount(<Tasking {...props} />);

    const opens_at = moment(now).add(1, 'day');
    const due_at = moment(now).add(3, 'day');

    tasking.find('.opens-at TutorDateInput input[onChange]')
      .simulate('change', { target: { value: opens_at.format('MM/DD/YYYY') } });
    tasking.find('.opens-at TutorTimeInput input').simulate('change', {
      target: { value: '8:22 pm' },
    });

    expect(
      tasking.find('.due-at TutorDateInput').props().min.toISOString()
    ).toEqual('2015-10-16T01:22:00.000Z');

    tasking.find('.due-at TutorDateInput input[onChange]')
      .simulate('change', { target: { value: due_at.format('MM/DD/YYYY') } });

    tasking.find('.due-at TutorTimeInput input').simulate('change', {
      target: { value: '945am' },
    });

    expect(
      tasking.find('.opens-at TutorDateInput').props().max.toISOString()
    ).toEqual(due_at.clone().hour(9).minute(45).toISOString());

    tasking.unmount();
  });

});
