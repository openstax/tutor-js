import { SnapShot, Wrapper } from './helpers';
import InvalidPage from '../../src/components/invalid-page';

describe('Invalid Page', () => {
  it('renders and matches snapshot', () => {
    const wrapper = shallow(<InvalidPage />);
    expect(wrapper).toHaveRendered('OXColoredStripe');
    expect.snapshot(
      <Wrapper _wrapped_component={InvalidPage} noReference />
    ).toMatchSnapshot();
  });

  it('renders a custom message', () => {
    const wrapper = shallow(<InvalidPage message="Yo test message" />);
    expect(wrapper.text()).toContain('Yo');
  });
});
