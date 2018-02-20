React = require 'react'
{Testing, expect, sinon, _} = require 'shared/specs/helpers'

Button = require 'components/buttons/async-button'
Failed = React.createClass
  render: -> React.createElement('span', {}, @props.beforeText)

describe 'Async Button Component', ->
  props = null

  beforeEach ->
    props =
      isWaiting: false,
      failedProps: {beforeText: 'yo, you failed'}

  describe 'waiting state', ->

    it 'hides spinner and is not disabled', ->
      Testing.renderComponent( Button, props: props ).then ({dom}) ->
        expect(dom.getAttribute('disabled')).to.be.null
        expect(dom.querySelector('i.fa-spinner')).to.be.null

    it 'shows spinner and is disabled when true', ->
      props.isWaiting = true
      Testing.renderComponent( Button, props: props ).then ({dom}) ->
        expect(dom.getAttribute('disabled')).equal('')
        expect(dom.querySelector('i.fa-spinner')).not.to.be.null

  it 'renders failed state', ->
    props.isFailed = true
    props.failedState = Failed
    Testing.renderComponent( Button, props: props ).then ({dom, element}) ->
      expect(element.props.failedState).equal(Failed)
      expect(dom.textContent).equal('yo, you failed')

  it 'sets timeout', (done) ->
    props.timeoutLength = 2
    props.isWaiting = true
    Testing.renderComponent( Button, unmountAfter: 10, props: props ).then ({dom, wrapper, element}) ->
      element.componentDidUpdate()
      expect(element.state.isTimedout).equal(false)
      _.delay ->
        expect(element.state.isTimedout).equal(true)
        done()
      , 3
    true #
