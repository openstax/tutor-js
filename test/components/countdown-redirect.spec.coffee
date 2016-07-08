{React, Testing, expect, sinon} = require './helpers/component-testing'

CountdownRedirect = require '../../src/components/countdown-redirect'

describe 'CountdownRedirect component', ->

  beforeEach ->
    @props =
      destinationUrl: 'http://test.example.com/'
      windowImpl:
        setInterval: sinon.stub()
        clearInterval: sinon.stub()
        location:
          replace: sinon.stub()

  it 'renders a string message', ->
    props = _.extend({message: 'test string'}, @props)
    Testing.renderComponent( CountdownRedirect, {props} ).then ({element, dom}) ->
      expect(dom.textContent).to.include('test string')

  it 'renders children and message element', ->
    props = _.extend({
      message: React.createElement('span', {}, 'test element')
      children: React.createElement('div', {className: 'child'}, 'ima child')
    }, @props)
    Testing.renderComponent( CountdownRedirect, {props} ).then ({element, dom}) ->
      expect(dom.textContent).to.include('test element')
      expect(dom.querySelector('div.child')?.textContent).to.include('ima child')

  it 'displays a counter that counts down', ->
    @props.secondsDelay = 4
    Testing.renderComponent( CountdownRedirect, {props: @props} ).then ({element, dom}) =>
      expect(dom.textContent).to.include('4 seconds')
      expect(@props.windowImpl.setInterval).to.have.been.called
      element.onCounterTick()
      expect(element.getDOMNode().textContent).to.include('3 seconds')

  it 'redirects when countdown is 0', ->
    @props.secondsDelay = 1
    Testing.renderComponent( CountdownRedirect, {props: @props} ).then ({element, dom}) =>
      expect(dom.textContent).to.include('1 seconds')
      element.onCounterTick()
      expect(@props.windowImpl.location.replace).to.have.been.calledWith(
        @props.destinationUrl
      )

  it 'clears timer on unmount', ->
    Testing.renderComponent( CountdownRedirect, {props: @props} ).then ({element, dom, root}) =>
      React.unmountComponentAtNode(root)
      expect(@props.windowImpl.clearInterval).to.have.been.called
