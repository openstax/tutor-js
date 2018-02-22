{Testing, expect, sinon, _} = require 'shared/specs/helpers'

Button = require 'components/buttons/close-button'

describe 'Close Button Component', ->
  props = null

  beforeEach ->
    props = {}

  it 'has proper classes', ->
    Testing.renderComponent( Button, props: props ).then ({dom}) ->
      expect(dom.tagName).equal('BUTTON')
      expect(dom.classList.contains('openstax-close-x')).to.be.true
