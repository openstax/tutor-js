import { runInAction } from '../helpers';
import ObscuredPage from '../../src/components/obscured-page';
import Overlay from '../../src/components/obscured-page/overlay';
import { OverlayRegistry } from '../../src/components/obscured-page/overlay-registry';
import Analytics from '../../src/helpers/analytics';
import keymaster from 'keymaster';

jest.mock('keymaster');
jest.mock('../../src/helpers/analytics');
jest.useFakeTimers();

const TestPage = () => <p>Hello From Page</p>;
const TestOverlay = () => <p>Hello From Overlay</p>;

const renderPage = (props, olprops) => {
    const page = mount(<ObscuredPage {...props}><TestPage /></ObscuredPage>);
    runInAction(() => {
        olprops = Object.assign({ ...props,
            onHide: jest.fn(), id: 'test',
            visible: false,
            renderer: jest.fn(() => <TestOverlay />),
        }, olprops);
    });
    return { page, overlay: mount(<Overlay {...olprops} />) };
};

describe(ObscuredPage, () => {

    let props;

    beforeEach(() => {
        props = {
            registry: new OverlayRegistry(),
        };
    });

    it('renders overlay', () => {
        const { page, overlay } = renderPage(props);
        expect(page).not.toHaveRendered('TestOverlay');
        overlay.setProps({ visible: true });
        expect(page).toHaveRendered('TestOverlay');
    });

    it('hides on esc key', () => {
        const { page, overlay } = renderPage(props, { visible: true });
        expect(keymaster).toHaveBeenCalledWith('esc', expect.any(Function));
        jest.runAllTimers();
        keymaster.mock.calls[0][1]();
        expect(overlay.props().onHide).toHaveBeenCalled();
        page.unmount();
        expect(keymaster.unbind).toHaveBeenCalledWith('esc', expect.any(Function));
    });

    it('sends page view to analytics', () => {
        const { overlay } = renderPage(props, { visible: false });
        expect(Analytics.sendPageView).not.toHaveBeenCalled();
        overlay.setProps({ visible: true });
        expect(Analytics.sendPageView).toHaveBeenCalledWith('/overlay/test');
    });

});
