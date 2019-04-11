import Renderer from 'react-test-renderer';
import Badges from 'components/exercise-badges';

describe('Exercise Preview Component', function() {
  let props = null;
  beforeEach(function() {
    props = {
      interactive: false,
      video: false,
      multiPart: false,
    };});

  it('doesnt render if no items were found', function() {
    const badges = mount(<Badges {...props} />);
    expect(badges.html()).toBeNull();
    badges.unmount();
  });

  it('renders interactive', function() {
    props.interactive = true;
    const badges = Renderer.create(<Badges {...props} />);
    expect(badges.toJSON()).toMatchSnapshot();
    badges.unmount();
  });

  it('renders for video', function() {
    props.video = true;
    const badges = Renderer.create(<Badges {...props} />);
    expect(badges.toJSON()).toMatchSnapshot();
    badges.unmount();
  });

  return it('renders for MPQs', function() {
    const badges = Renderer.create(<Badges {...props} />);
    expect(badges.toJSON()).toMatchSnapshot();
    badges.unmount();
  });
});
