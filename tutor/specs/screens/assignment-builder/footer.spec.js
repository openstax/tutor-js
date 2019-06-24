import UX from '../../../src/screens/assignment-builder/ux';
import Footer from '../../../src/screens/assignment-builder/footer';
import { Factory, C } from '../../helpers';

describe('Task Plan Footer', function() {
  let props, plan;

  beforeEach(() => {
    const course = Factory.course();
    plan = Factory.teacherTaskPlan({ course });
    const ux = new UX({ course, plan });
    props = { ux };
  });

  it('publishes', () => {
    const footer = mount(<Footer {...props} />);
    expect(footer).toHaveRendered(
      'SaveButton AsyncButton[isWaiting=false]'
    );
    plan.save = jest.fn();
    footer.find('SaveButton AsyncButton').simulate('click');
    expect(plan.save).toHaveBeenCalled();

    footer.find('SaveAsDraftButton AsyncButton').simulate('click');
    expect(plan.save).toHaveBeenCalledTimes(2);

    footer.unmount();
  });

});
