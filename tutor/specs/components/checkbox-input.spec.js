import CheckboxInput from '../../src/components/checkbox-input';
import { Formik as F } from 'formik';

describe('CheckboxInput', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'input_1',
      label: 'Input 1',
      id: 'input_1',
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<F><CheckboxInput {...props} /></F>).toMatchSnapshot();
  });
});
