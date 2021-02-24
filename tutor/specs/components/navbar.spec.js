import { Navbar } from '../../src/components/navbar';
import { NavbarContext } from '../../src/components/navbar/context';

describe('Main Navbar', () => {
    let props;

    beforeEach(() => {
        props = {
            area: 'header',
            context: new NavbarContext(),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<Navbar {...props} />).toMatchSnapshot();
    });

    it('sets parts', () => {
        props.context.left.set('l', () => <p className="testing">left</p>);
        const nb = mount(<Navbar {...props} />);
        expect(nb).toHaveRendered('.left-side-controls p.testing');
    });
});
