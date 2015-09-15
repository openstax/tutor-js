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
    @props =
      windowImpl:
        scroll: sinon.spy()
        location: { hash: '' }
        pageYOffset: 0
        addEventListener: sinon.spy()
        removeEventListener: sinon.spy()
        requestAnimationFrame: sinon.spy()

  it 'attaches event listeners when mounted', ->
    Testing.renderComponent( TestComponent, props: @props ).then ({element}) =>
      expect(@props.windowImpl.addEventListener).to.have.been.calledWith(
        'hashchange', element._onHashChange, false
      )

  it 'scrolls to target on page load if it exists', ->
    @props.windowImpl.location.hash = '#bar'
    Testing.renderComponent( TestComponent, props: @props ).then =>
      expect(@props.windowImpl.scroll).to.have.been.called

  it 'scrolls to an element', ->
    Testing.renderComponent( TestComponent, props: @props ).then ({dom, element}) =>
      element.scrollToElement(dom.querySelector('#foo'))
      expect(@props.windowImpl.scroll).to.have.been.called
