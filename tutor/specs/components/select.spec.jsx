import Select from '../../src/components/select';

describe('Select', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'select1',
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<Select {...props} />).toMatchSnapshot();
  });
});
