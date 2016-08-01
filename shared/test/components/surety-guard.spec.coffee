{Testing, expect, sinon, _} = require 'test/helpers'
React = require 'react'

SuretyGuard = require 'components/surety-guard'

WrappedComponent = React.createClass
  render: ->
    React.createElement(SuretyGuard, @props,
      React.createElement('a', {}, 'i am a test link')
    )

describe 'SuretyGuard', ->
  beforeEach ->
    @props =
      onConfirm: sinon.spy()
      message: 'Yo!, you sure?'

  it 'renders children', ->
    Testing.renderComponent( WrappedComponent, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.include('i am a test link')

  it 'displays when clicked', (done) ->
    Testing.renderComponent( WrappedComponent, props: @props ).then ({dom, element}) ->
      expect(window.document.querySelector('.openstax-surety-guard')).not.to.exist
      Testing.actions.click(dom)
      _.defer ->
        guard = window.document.querySelector('.openstax-surety-guard')
        expect(guard).to.exist
        expect(guard.textContent).to.include('Yo!')
        done()
