import Biology2eAvailable from '../../../../src/components/tours/custom/biology2eldavailable';

jest.mock('react-joyride', () => ({
  Tooltip: (props) => <div className={props.className}>{props.step.text}</div>,
}));

describe(Biology2eAvailable, () => {
  it('matches snapshot', () => {
    expect.snapshot(<Biology2eAvailable step={{ style: {}, ride: {} }} />).toMatchSnapshot();
  });
});
