import Footer from '../../../src/screens/assignment-builder/footer';
import { C, createUX } from './helpers';

describe('Task Plan Footer', function() {
  let props;

  beforeEach(() => {
    const ux = createUX();
    props = { ux };
  });

  it('publishes', () => {
    props.ux.form = {
      changed: true,
      isValid: true,
      get: () => ({}),
      canSave: true,
      onSaveRequested: jest.fn(),
    };
    const footer = mount(<C><Footer {...props} /></C>);
    expect(props.ux.canSave).toBe(true);
    props.ux.plan.is_published = false;
    footer.find('SaveButton AsyncButton').simulate('click');
    expect(props.ux.form.onSaveRequested).toHaveBeenCalled();
    expect(props.ux.plan.is_publish_requested).toBe(true);
    footer.unmount();
  });

});
