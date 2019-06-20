import Homework from '../../../src/screens/assignment-builder/homework';
import { Factory, C } from '../../helpers';

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
    const hw = mount(<C><Homework {...props} /></C>);
    // expect(props.plan.fetch).toHaveBeenCalled();
    //
    // console.log(hw.debug());
    // expect(hw).toHaveRendered('TaskPlanLoader');
    // props.plan.api.requestCounts.read += 1;
    // hw.render();

    //    expect(hw).toHaveRendered('TaskPlanLoader');


    hw.unmount();
  });
});
