React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'
assign = require 'lodash/assign'


STAGES = [
  require './select-type'
  require './select-dates'
  require './course-details'
]

NewCourse = React.createClass

  getInitialState: ->
    currentStage: 0

  contextTypes:
    router: React.PropTypes.object

  onContinue: (attrs) ->
    currentStage = @state.currentStage + 1
    @setState(assign({currentStage}, attrs))
  onCancel: ->  @context.router.transitionTo('/dashboard')

  render: ->
    Component = STAGES[@state.currentStage]
    <div className="new-course">
      <Component
        onContinue={@onContinue}
        onCancel={@onCancel}
        {...@state}
      />
    </div>



module.exports = NewCourse
