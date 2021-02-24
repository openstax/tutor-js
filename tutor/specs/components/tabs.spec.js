import { FakeWindow, R } from '../helpers';
import Tabs from '../../src/components/tabs';

const Body = () => <p>this is the body</p>;

describe('Change Student ID', () => {
    let props;

    beforeEach(() => {
        props = {
            onSelect: jest.fn(),
            selectedIndex: 1,
            tabs: [ '1', '2', '3' ],
            windowImpl: new FakeWindow,
        };
    });

    it('renders', () => {
        const tabs = mount(<R><Tabs {...props}><Body /></Tabs></R>);
        expect(
            tabs.find('[role="tab"]').at(props.selectedIndex).hasClass('active')
        ).toBeTruthy();
        tabs.unmount();
    });

    it('notifies when initial state is set from query params', () => {
        props.windowImpl.location.search = '?tab=2';
        const tabs = mount(
            <R><Tabs {...props}><Body /></Tabs></R>
        );
        expect(props.onSelect).toHaveBeenCalledWith(2, expect.anything());
        tabs.unmount();
    });

    it('sets query params and notifies when clicked', () => {
        const tabs = mount(
            <R><Tabs {...props}><Body /></Tabs></R>
        );
        tabs.find('[role="tab"] a').at(0).simulate('click');
        expect(props.onSelect).toHaveBeenCalledWith(0, expect.anything());
        tabs.unmount();
    });
});
