{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{LaptopAndMug, BackgroundAndDesk} = require 'concept-coach/launcher/items'


describe 'Launcher SVG items', ->
  beforeEach ->
    @props = {height: 42}

  it 'renders laptop and mug without errors', ->
    Testing.renderComponent( LaptopAndMug, props: @props ).then ({dom}) ->
      expect(dom.tagName).equal('svg')
      expect(dom.getAttribute('height')).equal('42px')

  it 'renders background and desk without errors', ->
    Testing.renderComponent( BackgroundAndDesk, props: @props ).then ({dom}) ->
      expect(dom.tagName.toLowerCase()).equal('div')
