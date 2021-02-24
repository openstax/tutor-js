import { React } from 'shared/specs/helpers';

import { inject, observer } from 'mobx-react';
import { SpyModeContent as Content, SpyModeWrapper as Wrapper } from '../../src/components/spy-mode';

function TestChildComponent() {
    return React.createElement('span', {}, 'i am a test');
}

describe('SpyMode', function() {

    describe('Wrapper', function() {

        it('renders a pi symbol', () => {
            expect.snapshot(<Wrapper />).toMatchSnapshot();
        });

        it('enables debug class when pi symbol is clicked', () => {
            const spy = mount(<Wrapper />);
            spy.find('.debug-toggle-link').simulate('click');
            spy.unmount();
        });

        it('renders child components', function() {
            const props = { children: React.createElement(TestChildComponent) };
            const spy = mount(<Wrapper {...props} />);
            expect(spy.text()).toMatch('i am a test');
            spy.unmount();
        });

        it('exposes context', function() {
            const Spy = inject('spyMode')(observer(({ spyMode }) =>
                <span data-spy-is-enabled={spyMode.isEnabled} />
            ));
            const wrapper = mount(<Wrapper><Spy /></Wrapper>);
            expect(wrapper).toHaveRendered({ 'data-spy-is-enabled': false });
            wrapper.find('.debug-toggle-link').simulate('click');
            expect(wrapper).toHaveRendered({ 'data-spy-is-enabled': true });
        });
    });

    describe('Content', function() {
        it('renders child components', function() {
            const props = { children: React.createElement(TestChildComponent) };
            const spy = mount(<Content {...props} />);
            expect(spy.text()).toMatch('i am a test');
            spy.unmount();
        });
    });
});
