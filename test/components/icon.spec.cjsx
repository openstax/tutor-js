{Testing, expect, sinon, _, ReactTestUtils} = require './helpers/component-testing'
React = require 'react/addons'
Icon = require '../../src/components/icon'

describe 'Icon Component', ->

  beforeEach ->
    @props = {type: 'test'}

  it 'renders', ->
    Testing.renderComponent( Icon, props: @props ).then ({dom}) ->
      expect(dom.tagName).to.equal('I')
      expect(_.toArray(dom.classList)).to.include('fa-test', 'fa')

  it 'renders with a tooltip', ->
    @props.tooltipProps = {placement: 'bottom'}
    @props.tooltip = 'a testing tooltip'
    Testing.renderComponent( Icon, props: @props ).then ({dom}) =>
      React.addons.TestUtils.Simulate.mouseOver(dom)
      tooltipEl = document.querySelector('div[role="tooltip"]')
      expect(tooltipEl.textContent).to.equal(@props.tooltip)
