import { SnapShot } from '../../helpers/component-testing';
import Biology2eAvailable from '../../../../src/components/tours/custom/biology2e_available';

jest.mock('react-joyride', () => ({
  Tooltip: (props) => <div className={props.className}>{props.step.text}</div>,
}));

describe(Biology2eAvailable, () => {
  it('matches snapshot', () => {
    expect(SnapShot.create(<Biology2eAvailable step={{ style: {}, ride: {} }} />).toJSON()).toMatchSnapshot();
  });
});
