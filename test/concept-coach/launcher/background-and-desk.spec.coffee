{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

BackgroundAndDesk = require 'concept-coach/launcher/background-and-desk'


describe 'Background with Desk', ->

  it 'renders background and desk without errors', ->
    Testing.renderComponent( BackgroundAndDesk, props: @props ).then ({dom}) ->
      expect(dom.tagName.toLowerCase()).equal('div')
