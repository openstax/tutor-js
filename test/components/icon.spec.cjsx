{Testing, expect, sinon, _, ReactTestUtils} = require './helpers/component-testing'

Icon = require '../../src/components/icon'

describe 'Icon Component', ->

  beforeEach ->
    @props = { type: 'test' }

  it 'renders', ->
    Testing.renderComponent( Icon, props: @props ).then ({dom}) ->
      expect(dom.tagName).to.equal('I')
      expect(_.toArray(dom.classList)).to.include('fa-test', 'fa')

  it 'renders with a tooltip', ->
    @props.tooltip = 'a testing tooltip'
    Testing.renderComponent( Icon, props: @props ).then ({dom}) ->
      # Can't figure out how to find the actual DOM element that's rendered by the tooltip
      expect(dom.tagName).to.equal('I')
      expect(_.toArray(dom.classList)).to.include('fa-test', 'fa')
