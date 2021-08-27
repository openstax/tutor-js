import Badges from 'components/exercise-badges';

describe('Exercise Preview Component', function() {
    let props = null;
    beforeEach(function() {
        props = {};
    });

    it('doesnt render if no items were found', function() {
        const badges = mount(<Badges {...props} />);
        expect(badges.html()).toBe('');
        badges.unmount();
    });

    it('renders interactive', function() {
        props.interactive = true;
        expect.snapshot(<Badges {...props} />).toMatchSnapshot();
    });

    it('renders for video', function() {
        props.video = true;
        expect.snapshot(<Badges {...props} />).toMatchSnapshot();
    });

    it('renders for MPQs', function() {
        props.multiPart = true;
        expect.snapshot(<Badges {...props} />).toMatchSnapshot();
    });

    // issues with popper mock
    xit('renders for personalized', function() {
        expect.snapshot(<Badges {...props} />).toMatchSnapshot();
    });
});
