import RadioInput from '../../src/components/radio-input';

describe('RadioInput', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'input_1',
      label: 'Input 1',
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<RadioInput {...props} />).toMatchSnapshot();
  });
});
