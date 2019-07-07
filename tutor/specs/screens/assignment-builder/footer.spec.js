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
    props.ux.form = {
      changed: true,
      isValid: true,
      get: () => ({}),
      onSubmit: jest.fn(),
    };
    const footer = mount(<C><Footer {...props} /></C>);
    expect(props.ux.canSave).toBe(true);
    footer.find('SaveButton AsyncButton').simulate('click');
    expect(props.ux.form.onSubmit).toHaveBeenCalled();
    expect(props.ux.plan.is_publish_requested).toBe(true);

    footer.unmount();
  });

});
