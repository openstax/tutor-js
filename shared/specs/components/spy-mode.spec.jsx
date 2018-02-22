import { Testing, _ } from 'shared/specs/helpers';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { SpyModeContent as Content, SpyModeWrapper as Wrapper } from 'shared/components/spy-mode';

function TestChildComponent() {
  return React.createElement('span', {}, 'i am a test');
}

describe('SpyMode', function() {

  describe('Wrapper', function() {
    it('renders with className', () =>
      Testing.renderComponent( Wrapper ).then(function({ dom }) {
        expect(dom.classList.contains('openstax-debug-content')).to.be.true;
        return expect(dom.classList.contains('is-enabled')).to.be.false;
      })
    );

    it('renders a pi symbol', () =>
      Testing.renderComponent( Wrapper ).then(({ dom }) => expect(dom.querySelector('.debug-toggle-link').textContent).equal('π'))
    );

    it('enables debug class when pi symbol is clicked', () =>
      Testing.renderComponent( Wrapper ).then(function({ dom }) {
        Testing.actions.click(dom.querySelector('.debug-toggle-link'));
        return _.defer(() => expect(dom.classList.contains('is-enabled')).to.be.true);
      })
    );

    it('renders child components', function() {
      const props = { children: React.createElement(TestChildComponent) };
      return Testing.renderComponent( Wrapper, { props } ).then(({ dom }) => expect(dom.textContent).equal('i am a testπ'));
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
    it('renders with className', () =>
      Testing.renderComponent( Content ).then(({ dom }) => expect(dom.classList.contains('visible-when-debugging')).to.be.true)
    );

    it('renders child components', function() {
      const props = { children: React.createElement(TestChildComponent) };
      return Testing.renderComponent( Content, { props } ).then(({ dom }) => expect(dom.textContent).equal('i am a test'));
    });
  });
});
