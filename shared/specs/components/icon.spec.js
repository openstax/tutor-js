import { React } from '../helpers';
import Icon, { Icons }  from '../../src/components/icon';
import { last } from 'lodash';

describe('Icon Component', function() {
    let props = {};

    beforeEach(() => props = { type: 'ghost' });

    it('correctly requires everything', () => {
        Object.keys(Icons).forEach(k => {
            expect(Icons[k]).toBeTruthy();
        });
    });

    it('renders', () => {
        expect.snapshot(<Icon {...props} />).toMatchSnapshot();
    });

    it('renders with a tooltip', () => {
        props.tooltipProps = { placement: 'bottom' };
        props.tooltip = 'a testing tooltip';
        const icon = shallow(<Icon {...props} />);
        expect(icon).toHaveRendered('OverlayTrigger');
        icon.unmount();
    });

    it('renders as button when given an onClick', () => {
        props.onClick = jest.fn();
        const icon = mount(<Icon {...props} />);
        expect(icon).toHaveRendered('Button');
        icon.find('Button').simulate('click');
        expect(props.onClick).toHaveBeenCalled();
        icon.unmount();
    });

    it('sets on-navbar css class', () => {
        props.onNavbar = true;
        props.tooltipProps = { placement: 'bottom' };
        props.tooltip = 'a testing tooltip';
        const icon = mount(<Icon {...props} />);
        icon.find('FontAwesomeIcon').simulate('mouseover');
        const tooltipEl = last(document.body.querySelectorAll('[role=tooltip]'));
        expect(tooltipEl.classList).toContain('on-navbar');
        icon.unmount();
    });

    it('adds props from variants', () => {
        props = { variant: 'errorInfo' };
        const icon = mount(<Icon {...props} />);
        expect(icon).toHaveRendered('svg[data-icon="exclamation-circle"]');
        icon.unmount();
    });
});
