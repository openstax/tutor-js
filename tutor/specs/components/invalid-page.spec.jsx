import { SnapShot, Wrapper } from './helpers/component-testing';
import InvalidPage from '../../src/components/invalid-page';

describe('Invalid Page', () => {
  it('renders and matches snapshot', () => {
    const wrapper = shallow(<InvalidPage />);
    expect(wrapper).toHaveRendered('OXColoredStripe');
    expect(SnapShot.create(
      <Wrapper _wrapped_component={InvalidPage} noReference />).toJSON()
    ).toMatchSnapshot();
  });
});
