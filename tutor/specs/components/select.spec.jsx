import Select from '../../src/components/select';
import { Formik as F } from 'formik';

describe('Select', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'select1',
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<F><Select {...props} /></F>).toMatchSnapshot();
  });
});
