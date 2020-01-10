import TimeInput from '../../src/components/time-input';
import { Formik as F } from 'formik';

describe('TimeInput', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'ti',
      value: '13:00',
      onChange: jest.fn(),
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<F><TimeInput {...props} /></F>).toMatchSnapshot();
  });

  it('sets to value', () => {
    const ti = mount(<F initialValues={{ ti: '09:11' }}><TimeInput {...props} /></F>);
    ti.find('select[name="ti_hour"]').simulate('change', { target: { value: '2' } });
    ti.find('select[name="ti_minute"]').simulate('change', { target: { value: '42' } });
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { name: props.name, value: '02:42' },
      })
    );
    ti.unmount();
  });
});
