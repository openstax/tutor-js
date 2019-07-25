import SetTimeAsDefault from '../../../../src/screens/assignment-builder/builder/set-time-as-default';
import { Factory, TimeMock } from '../../../helpers';


describe('Set time as default', () => {
  let tasking, props;

  TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    const course = Factory.course();
    const plan = Factory.teacherTaskPlan({ course });
    plan.course = course;
    tasking = plan.tasking_plans[0];

    props = { tasking, type: 'due' };
  });

  it('sets times', () => {
    tasking.setDueTime('15:18');
    expect(tasking.isUsingDefaultDueAt).toBe(false);
    const set = mount(<SetTimeAsDefault {...props} />);

    tasking.course.save = jest.fn();

    set.find('AsyncButton button').simulate('click');
    expect(tasking.course.save).toHaveBeenCalled();

    expect(tasking.isUsingDefaultDueAt).toBe(true);
    set.unmount();
  });
});
