import TroubleIcon from '../../../src/components/icons/trouble';
import Plan from '../../../src/models/task-plans/teacher/plan';

describe('Student Preview Builder', () => {

  let props;

  beforeEach(() => {
    props = { plan: new Plan({ is_trouble: true }) };
  });

  it('only renders if plan is in trouble', () => {
    props.plan.is_trouble = false;
    const plan = mount(<TroubleIcon {...props} />);
    expect(plan.html()).toBeNull();
  });

  it('matches snapshot', () => {
    const plan = mount(<TroubleIcon {...props} />);
    expect.snapshot(plan.debug()).toMatchSnapshot();
  });

});
