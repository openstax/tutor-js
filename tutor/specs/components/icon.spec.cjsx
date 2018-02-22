{Testing, sinon, _, ReactTestUtils} = require './helpers/component-testing'
React = require 'react'
Icon = require '../../src/components/icon'

describe 'Icon Component', ->
  props = {}

  beforeEach ->
    props = {type: 'test'}

  it 'renders', ->
    Testing.renderComponent( Icon, props: props ).then ({dom}) ->
      expect(dom.tagName).to.equal('I')
      expect(_.toArray(dom.classList)).to.include('fa-test', 'fa')

  it 'renders with a tooltip', ->
    props.tooltipProps = {placement: 'bottom'}
    props.tooltip = 'a testing tooltip'
    Testing.renderComponent( Icon, props: props ).then ({dom}) =>
      #icon should be a button so it's easy to tap and click when tooltip prop is defined
      expect(dom.tagName).to.equal('BUTTON')

      ReactTestUtils.Simulate.mouseOver(dom)
      tooltipEl = document.querySelector('div[role="tooltip"]')
      expect(tooltipEl.textContent).to.equal(props.tooltip)


  it 'sets on-navbar css class', ->
    props.onNavbar = true
    props.tooltipProps = {placement: 'bottom'}
    props.tooltip = 'a testing tooltip'
    Testing.renderComponent( Icon, props: props ).then ({dom}) ->
      ReactTestUtils.Simulate.mouseOver(dom)
      tooltipEl = _.last document.querySelectorAll('div[role="tooltip"]')
      expect(_.toArray(tooltipEl.classList)).to.include('on-navbar')
