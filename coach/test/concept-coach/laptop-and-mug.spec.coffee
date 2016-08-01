{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

LaptopAndMug = require 'concept-coach/laptop-and-mug'

describe 'Laptop and Mug SVG', ->
  beforeEach ->
    @props = {height: 42}

  it 'renders laptop and mug without errors', ->
    Testing.renderComponent( LaptopAndMug, props: @props ).then ({dom}) ->
      expect(dom.tagName).equal('svg')
      expect(dom.getAttribute('height')).equal('42px')
