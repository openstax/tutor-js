import { createUX, TimeMock } from '../helpers';
import SaveBtn from '../../../../src/screens/assignment-builder/footer/save-button';

describe('Task Plan Builder: Delete button', () => {

  let ux;

  const now = TimeMock.setTo('2018-01-01');

  beforeEach(async () => {
    ux = await createUX({ now });
  });

  it('publishes', () => {
    ux.form.plan = { is_published: false, isValid: true };
    const btn = mount(<SaveBtn ux={ux} />);
    expect(ux.form.isValid).toBe(true);
    expect(ux.canSave).toBe(true);
    btn.find('SaveButton AsyncButton').simulate('click');
    expect(ux.plan.is_publish_requested).toBe(true);
    btn.unmount();
  });

});
