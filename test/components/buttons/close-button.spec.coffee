{Testing, expect, sinon, _} = require 'test/helpers'

Button = require 'components/buttons/close-button'

describe 'Close Button Component', ->

  beforeEach ->
    @props = {}

  it 'has proper classes', ->
    Testing.renderComponent( Button, props: @props ).then ({dom}) ->
      expect(dom.getAttribute('aria-role')).equal('close')
      expect(dom.tagName).equal('BUTTON')
      expect(dom.classList.contains('openstax-close-x')).to.be.true
