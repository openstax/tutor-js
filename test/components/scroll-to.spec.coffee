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
        requestAnimationFrame: sinon.spy()

  it 'scrolls to target on page load if it exists', ->
    @props.windowImpl.location.hash = '#bar'
    Testing.renderComponent( TestComponent, props: @props ).then =>
      expect(@props.windowImpl.scroll).to.have.been.called

  it 'scrolls when a link is clicked', (done) ->
    Testing.renderComponent( TestComponent, props: @props ).then ({dom}) =>
      expect(@props.windowImpl.scroll).not.to.have.been.called
      # Testing.actions.click() isn't used because the mixin uses plain DOM events
      dom.querySelector('a').click()
      _.delay( =>
        expect(@props.windowImpl.scroll).to.have.been.called
        done()
      , 4)

  it 'scrolls to an element', ->
    Testing.renderComponent( TestComponent, props: @props ).then ({dom, element}) =>
      element.scrollToElement(dom.querySelector('#foo'))
      expect(@props.windowImpl.scroll).to.have.been.called
