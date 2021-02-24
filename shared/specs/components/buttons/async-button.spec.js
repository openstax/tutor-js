import React from 'react';
import Button from 'components/buttons/async-button';

describe('Async Button Component', function() {
    let props = null;

    beforeEach(() =>
        props = {
            isWaiting: false,
            failedProps: { beforeText: 'yo, you failed' },
        });

    describe('waiting state', function() {

        it('hides spinner and is not disabled', () => {
            const button = mount(<Button {...props} />);
            expect(button).toHaveRendered('Button[disabled=false]');
            expect(button).not.toHaveRendered('Icon');
            button.unmount();
        });

        it('shows spinner and is disabled when true', function() {
            props.isWaiting = true;
            const button = mount(<Button {...props} />);
            expect(button).toHaveRendered('Button[disabled=true]');
            expect(button).toHaveRendered('Icon');
            button.setProps({ isDisabled: true });
            expect(button).toHaveRendered('button[disabled]');
            button.unmount();
        });
    });

    it('renders failed state', function() {
        props.isFailed = true;
        const button = mount(<Button {...props} />);
        expect(button).toHaveRendered('RefreshButton');
        button.unmount();
    });


});
