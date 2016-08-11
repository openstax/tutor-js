{React, Testing, expect, _, sinon} = require './helpers/component-testing'

ScrollSpy = require '../../src/components/scroll-spy'

NestedComponent = React.createClass
  render: ->
    <span />

RootComponent = React.createClass
  render: ->
    <div>
      <ScrollSpy {...@props}>
        <NestedComponent onScreenElements={[]} />
      </ScrollSpy>
    </div>

class FakeElement
  constructor: (@attr, top, bottom) -> @rect = {top, bottom}
  getBoundingClientRect: -> @rect
  getAttribute: -> @attr

describe 'ScrollSpy Component', ->

  beforeEach ->
    @stubbedElements = []
    @windowListeners = {}

    @props =
      dataSelector:'data-foo'
      windowImpl:
        innerHeight: 1000
        document: { querySelectorAll: => @stubbedElements }
        addEventListener: (name, callback) =>
          @windowListeners[name] = callback

  it 'sets visible elements on mount', ->
    @stubbedElements = [ new FakeElement('el1', 10, 200) ]
    Testing.renderComponent( RootComponent, props: @props ).then  ({element}) ->
      nested = React.addons.TestUtils.findRenderedComponentWithType(element, NestedComponent)
      expect(nested.props.onScreenElements).to.deep.equal(['el1'])

  it 'relays visible elements on scroll', ->
    @stubbedElements = [ new FakeElement('el1', 10, 200) ]
    Testing.renderComponent( RootComponent, props: @props ).then  ({element}) =>
      @stubbedElements.push( new FakeElement('el2', 200, 800) )
      nested = React.addons.TestUtils.findRenderedComponentWithType(element, NestedComponent)
      fn() for evName, fn in @windowListeners when evName is 'scroll'
      _.delay ->
        expect(nested.props.onScreenElements).to.deep.equal(['el2', 'el1'])
      , 105 # greater than the 100ms onscroll debounce that scroll-spy uses

  it 'does not relay off screen elements', ->
    @stubbedElements = [
      new FakeElement('el1', -800, -200),
      new FakeElement('el2', -100, 1200), # completely fills screen
      new FakeElement('el31', 1100, 1200)
    ]
    Testing.renderComponent( RootComponent, props: @props ).then  ({element}) ->
      nested = React.addons.TestUtils.findRenderedComponentWithType(element, NestedComponent)
      expect(nested.props.onScreenElements).to.deep.equal(['el2'])
