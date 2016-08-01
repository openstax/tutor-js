{Testing, expect, sinon, _} = require 'test/helpers'
React = require 'react'

SpyMode = require 'components/spy-mode'

TestChildComponent = React.createClass
  render: -> React.createElement('span', {}, 'i am a test')

describe 'SpyMode', ->

  describe 'Wrapper', ->
    it 'renders with className', ->
      Testing.renderComponent( SpyMode.Wrapper ).then ({dom}) ->
        expect(dom.classList.contains('openstax-debug-content')).to.be.true
        expect(dom.classList.contains('is-enabled')).to.be.false

    it 'renders a pi symbol', ->
      Testing.renderComponent( SpyMode.Wrapper ).then ({dom}) ->
        expect(dom.querySelector('.debug-toggle-link').textContent).equal('π')

    it 'enables debug class when pi symbol is clicked', ->
      Testing.renderComponent( SpyMode.Wrapper ).then ({dom}) ->
        Testing.actions.click(dom.querySelector('.debug-toggle-link'))
        _.defer ->
          expect(dom.classList.contains('is-enabled')).to.be.true

    it 'renders child components', ->
      props = {children: React.createElement(TestChildComponent)}
      Testing.renderComponent( SpyMode.Wrapper, {props} ).then ({dom}) ->
        expect(dom.textContent).equal('i am a testπ')

  describe 'Content', ->
    it 'renders with className', ->
      Testing.renderComponent( SpyMode.Content ).then ({dom}) ->
        expect(dom.classList.contains('visible-when-debugging')).to.be.true

    it 'renders child components', ->
      props = {children: React.createElement(TestChildComponent)}
      Testing.renderComponent( SpyMode.Content, {props} ).then ({dom}) ->
        expect(dom.textContent).equal('i am a test')
