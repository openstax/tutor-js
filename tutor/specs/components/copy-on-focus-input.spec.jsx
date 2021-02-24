import Clipboard from '../../src/helpers/clipboard';
import CopyOnFocusInput from '../../src/components/copy-on-focus-input';

jest.mock('../../src/helpers/clipboard');

describe('CopyOnFocusInput', () => {
    let props;

    beforeEach(() => {
        Clipboard.copy.mockClear();
        props = {
            value: 'a string that is important',
        };
    });

    it('renders and copys when focused', () => {
        const wrapper = mount(<CopyOnFocusInput {...props} />);
        expect(Clipboard.copy).not.toHaveBeenCalled();
        wrapper.simulate('focus');
        expect(Clipboard.copy).toHaveBeenCalled();
    });

    it('can auto-focus', () => {
        props.focusOnMount = true;
        expect(Clipboard.copy).not.toHaveBeenCalled();
        mount(<CopyOnFocusInput {...props} />);
        expect(Clipboard.copy).toHaveBeenCalled();
    });

    it('can render a label', () => {
        props.label = 'Click me!';
        props.className = 'test-123';
        const input = mount(<CopyOnFocusInput {...props} />);
        expect(input).toHaveRendered(`label[className="copy-on-focus ${props.className}"]`);
        expect(input).toHaveRendered(`input[value="${props.value}"]`);
        expect(input.text()).toContain('Click me!');
    });

});
