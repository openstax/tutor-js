import { FakeWindow } from '../../helpers';
import ReloadButton from '../../../src/components/buttons/reload-page';

describe('Reload Button', () => {
    let props;

    beforeEach(() => {
        props = {
            windowImpl: new FakeWindow(),
        };
    });

    it('reloads when clicked', () => {
        const rb = mount(<ReloadButton {...props} />);
        expect.snapshot(rb.debug()).toMatchSnapshot();
        rb.find('button').simulate('click');
        expect(props.windowImpl.location.reload).toHaveBeenCalledWith(true);
        rb.unmount();
    });

});
