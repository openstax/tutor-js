{React, Testing, expect, _} = require './helpers/component-testing'

PagingNavigation = require '../../src/components/paging-navigation'

TestChild = React.createClass
  render: ->
    <span>Hi Ima child</span>

describe 'Paging Navigation component', ->

  beforeEach ->
    @props =
      onForwardNavigation:  sinon.spy()
      onBackwardNavigation: sinon.spy()
      forwardHref:          '/test/forward'
      backwardHref:         '/test/backward'
      isForwardEnabled:     true
      isBackwardEnabled:    true
      children:  <TestChild />

  it 'renders children', ->
    Testing.renderComponent( PagingNavigation, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.include('Ima child')

  it 'calls callbacks', ->
    Testing.renderComponent( PagingNavigation, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.next'))
      expect( @props.onForwardNavigation ).to.have.been.calledWith(@props.forwardHref)

  it 'renders paging as disabled', ->
    @props.isForwardEnabled = false
    Testing.renderComponent( PagingNavigation, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.next[disabled]')).to.exist
      expect(dom.querySelector('.prev[disabled]')).not.to.exist
      expect(dom.querySelector('.next').tabIndex).to.eq(-1)
      expect(dom.querySelector('.prev').tabIndex).to.eq(0)
