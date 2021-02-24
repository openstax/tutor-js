import Button from 'components/buttons/close-button';

describe('Close Button Component', function() {
    let props = null;

    beforeEach(() => props = {});

    it('has proper classes', () => {
        expect.snapshot(<Button {...props} />).toMatchSnapshot();
    });

});
