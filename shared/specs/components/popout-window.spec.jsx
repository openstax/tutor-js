import PopoutWindow from '../../src/components/popout-window';
import FakeWindow from '../helpers/fake-window';
import TestRenderer from 'react-test-renderer';

xdescribe('PopoutWindow Component', () => {

    let props;
    beforeEach(() => {
        props = {
            title: 'testing Popup',
            onClose: jest.fn(),
            options: { width: 800 },
            windowImpl: new FakeWindow(),
        };
    });

    it('renders and opens', () => {
        const win = TestRenderer.create(
            <PopoutWindow {...props}><h1>Hiya</h1></PopoutWindow>
        );
        win.unmount();
    });

    it('re-renders and focuses when re-opened', () => {
        const popup = mount(<PopoutWindow {...props}><h1>Hiya</h1></PopoutWindow>);
        const win = popup.instance();
        win.open();
        expect(win.isOpen).toBe(true);
        win.popup.focus = jest.fn();
        win.open();
        expect(win.popup.focus).toHaveBeenCalled();
    });

    it('fires callback when closed', () => {
        const win = mount(<PopoutWindow {...props}><h1>Hiya</h1></PopoutWindow>).instance();
        win.open();
        // jsdom doesn’t seem to fire the event :(
        // win.popup.close();
        win.popup.onbeforeunload();
        expect(props.onClose).toHaveBeenCalled();
        expect(win.isOpen).toBe(false);
    });

});
