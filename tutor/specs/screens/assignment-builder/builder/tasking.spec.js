import Tasking from '../../../../src/screens/assignment-builder/builder/tasking';
import UX from '../../../../src/screens/assignment-builder/ux';
import { Factory, C } from '../../../helpers';


describe('Tasking Builder', () => {

  let props, ux, plan;

  beforeEach(() => {
    const course = Factory.course();
    plan = Factory.teacherTaskPlan({ course });
    const ux = new UX({ course, plan });
    props = { ux };
  });

  it('sets times', function() {
    const tasking = mount(<C><Tasking {...props} /></C>);
    console.log(tasking.debug());
    tasking.unmount();
  });

});
