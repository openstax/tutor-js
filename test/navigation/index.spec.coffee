React = require 'react'
{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

{Navigation} = require 'navigation'
Course = require 'course/model'
STATUS = require '../../auth/status/GET'

Wrapper = React.createClass
  childContextTypes:
    close: React.PropTypes.func
    view: React.PropTypes.string

  getChildContext: ->
    _.pick @props, 'close', 'view'

  render: ->
    React.createElement(Navigation, @props)


describe 'Navigation Component', ->

  beforeEach ->
    @props =
      course: new Course(STATUS.courses[0])
      close: sinon.spy()
      view: 'progress'

  it 'calls close callback', ->
    Testing.renderComponent(Wrapper, props: @props).then ({dom}) =>
      Testing.actions.click(dom.querySelector('button.close'))
      expect(@props.close).to.have.been.called

  it 'hides progress if course is not registered', ->
    sinon.stub(@props.course, 'isRegistered').returns(false)
    Testing.renderComponent(Wrapper, props: @props).then ({dom}) ->
      expect(dom.querySelector('.-progress')).to.be.null
