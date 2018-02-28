{Testing, expect, sinon, _} = require 'shared/specs/helpers'

Button = require 'components/buttons/refresh-button'

describe 'Refresh Button Component', ->
  props = null

  beforeEach ->
    props =
      beforeText: 'before '
      buttonText: 'Refresh'
      afterText: ' after'

  it 'can use custom text', ->
    Testing.renderComponent( Button, props: props ).then ({dom}) ->
      expect(dom.textContent).equal('before Refresh after')
