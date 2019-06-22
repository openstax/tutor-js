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
    footer.find('SaveButton AsyncButton[isWaiting=false]').simulate('click');
    expect(plan.save).toHaveBeenCalled();
//    plan.api.requestsInProgress
//    console.log(footer.debug())
    footer.unmount();

    // const reading = helper(NEW_READING);
    // //    console.log(reading.debug())
    // expect(reading).not.toHaveRendered('DeleteTaskButton Button');
    // expect(reading).toHaveRendered('SaveTaskButton');
    // expect(reading.find('SaveTaskButton').text()).toEqual('Publish');
    // expect(reading).toHaveRendered('HelpTooltip');
  });

});
