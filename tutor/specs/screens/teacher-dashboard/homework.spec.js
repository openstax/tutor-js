import Homework from '../../../src/screens/assignment-builder/homework';
import { Factory } from '../../helpers';

// import UiSettings from 'shared/model/ui-settings';
// import Helper from '../../../src/screens/teacher-dashboard/helper';
// jest.mock('../../../src/helpers/router', () => ({ currentQuery: jest.fn(() => ({})) }));
// jest.useFakeTimers();

describe('Homework Builder', function() {
  let props;

  beforeEach(() => {
    const course = Factory.course();
    const plan = Factory.teacherTaskPlans({ course, count: 1 }).array[0];
    plan.fetch = jest.fn();

    props = { course, plan, params: { id: plan.id } };
  });

  it('loads', function() {
    const hw = mount(<Homework {...props} />);
    expect(props.plan.fetch).toHaveBeenCalled();
    expect(hw).toHaveRendered('TaskPlanLoader');
    props.plan.api.requestCounts.read += 1;
    hw.render();
//    expect(hw).toHaveRendered('TaskPlanLoader');

    console.log(hw.debug());

    hw.unmount();
  });
});
