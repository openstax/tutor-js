import Button from 'components/buttons/refresh-button';

describe('Refresh Button Component', function() {
    let props = null;

    beforeEach(() => {
        props = {
            beforeText: 'before ',
            buttonText: 'Refresh',
            afterText: ' after',
        };
    });

    it('can use custom text', () => {
        const btn = mount(<Button {...props} />);
        expect(btn.text()).toMatch('before Refresh after');
        btn.unmount();
    });

});
