import keymaster from 'keymaster';
import Nav from '../../src/components/paging-navigation';

jest.mock('keymaster');

function TestComponent() {
    return <h1>Imma child</h1>;
}

describe('Paging Navigation', () => {
    let props;

    beforeEach(() => {
        props = {
            documentImpl: {
                title: 'test',
            },
            className: 'my-nav-test',
            onForwardNavigation:  jest.fn(),
            onBackwardNavigation: jest.fn(),
            isForwardEnabled:     true,
            isBackwardEnabled:    true,
            titles: {
                next: 'The Page That Comes After This One',
                current: 'Set From Nav',
                previous: 'The Page Before This One',
            },
        };
    });

    it('binds / unbinds on mount/unmount', () => {
        jest.useFakeTimers();
        const nav = shallow(<Nav {...props}><TestComponent /></Nav>);
        jest.runAllTimers();
        expect(keymaster).toHaveBeenCalledTimes(2);
        expect(keymaster).toHaveBeenCalledWith('left', expect.any(Function));
        expect(keymaster).toHaveBeenCalledWith('right', expect.any(Function));

        nav.setProps({ enableKeys: false });
        expect(keymaster.unbind).toHaveBeenCalledWith('left');
        expect(keymaster.unbind).toHaveBeenCalledWith('right');
        nav.setProps({ enableKeys: true });
        jest.runAllTimers();
        expect(keymaster).toHaveBeenCalledTimes(4);
        nav.unmount();
        expect(keymaster.unbind).toHaveBeenCalledTimes(4);
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<Nav {...props}><TestComponent /></Nav>).toMatchSnapshot();
    });

    it('is accessibile', async () => {
        jest.useRealTimers();
        const wrapper = mount(<Nav {...props}><TestComponent /></Nav>);
        wrapper.unmount()
    });

    it('sets titles', () => {
        const wrapper = shallow(<Nav {...props}><TestComponent /></Nav>);
        expect(props.documentImpl.title).toEqual('Set From Nav');
        expect(wrapper).toHaveRendered(`a.next[title="${props.titles.next}"]`);
        expect(wrapper).toHaveRendered(`a.prev[title="${props.titles.previous}"]`);
        wrapper.unmount()
    });

    it('calls prop fns', () => {
        const nav = shallow(<Nav {...props}><TestComponent /></Nav>);
        const preventDefault = jest.fn();
        nav.find('a.next').simulate('click', { preventDefault });
        expect(props.onForwardNavigation).toHaveBeenCalled();
        nav.find('a.prev').simulate('click', { preventDefault } );
        expect(props.onBackwardNavigation).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalledTimes(2);
        nav.unmount()
    });

});
