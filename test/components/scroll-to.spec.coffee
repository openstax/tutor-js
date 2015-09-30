{React, Testing, expect, _, sinon} = require './helpers/component-testing'

ScrollTo = require '../../src/components/scroll-to'

TestComponent = React.createClass
  mixins: [ScrollTo]

  render: ->
    React.createElement('div', {}, [
      React.createElement('div', {key: 'bar', id: 'bar', style: height: 1000},
        React.createElement('a', {href: '#foo'}, 'click me')
      )
      React.createElement('div', {key: 'foo', id: 'foo'}, 'a test of scrolling')
    ])
  getScrollTopOffset: 0
  getScrollDuration: 2 # speedy scroll for tests

describe 'ScrollTo Mixin', ->

  beforeEach ->
    # TODO clean up location and window stubs to include in `helpers/component-testing`
    windowListeners = {}

    _location =
      hash: ''
    locationStub = {}
    locationGetSet =
      get: ->
        _location.hash
      set: (value) ->
        _location.hash = value
        windowListeners.hashchange?()
    Object.defineProperty locationStub, 'hash', locationGetSet

    @props =
      windowImpl:
        scroll: sinon.spy()
        location: locationStub
        pageYOffset: 0
        requestAnimationFrame: sinon.spy()
        addEventListener: (name, callback) ->
          windowListeners[name] = callback
        removeEventListener: (name, callback) ->
          delete windowListeners[name] if windowListeners[name] is callback

  it 'scrolls to target on page load if it exists', ->
    @props.windowImpl.location.hash = '#bar'
    Testing.renderComponent( TestComponent, props: @props ).then =>
      expect(@props.windowImpl.scroll).to.have.been.called

  it 'scrolls to target on hash change', ->
    @props.windowImpl.location.hash = '#bar'
    Testing.renderComponent( TestComponent, props: @props ).then ({element, dom}) =>
      element.scrollToElement = sinon.spy()
      testHash = '#foo'
      fooDOM = dom.querySelector(testHash)

      @props.windowImpl.location.hash = testHash
      expect(element.scrollToElement).to.have.been.calledWith(fooDOM)

  it 'scrolls to an element', ->
    Testing.renderComponent( TestComponent, props: @props ).then ({dom, element}) =>
      element.scrollToElement(dom.querySelector('#foo'))
      expect(@props.windowImpl.scroll).to.have.been.called
