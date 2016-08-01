{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'
React = require 'react'
{ExerciseButton} = require 'buttons'

TestChildComponent = React.createClass
  render: -> React.createElement('span', {}, 'i am a label')

describe 'Exercise Button', ->
  beforeEach ->
    @props =
      children: React.createElement(TestChildComponent)
      onClick: sinon.spy()

  it 'renders child components', ->
    Testing.renderComponent( ExerciseButton, props: @props ).then ({dom}) ->
      expect(dom.textContent).equal('i am a label')

  it 'calls onClick callback', ->
    Testing.renderComponent( ExerciseButton, props: @props ).then ({dom}) =>
      Testing.actions.click dom.querySelector('span')
      expect(@props.onClick).to.have.been.called
