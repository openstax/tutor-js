{Testing, expect, sinon, _} = require 'test/helpers'

Button = require 'components/buttons/refresh-button'

describe 'Refresh Button Component', ->

  beforeEach ->
    @props =
      beforeText: 'before '
      buttonText: 'Refresh'
      afterText: ' after'

  it 'can use custom text', ->
    Testing.renderComponent( Button, props: @props ).then ({dom}) ->
      expect(dom.textContent).equal('before Refresh after')
