React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'
{ExerciseActions, ExerciseStore} = require '../../flux/exercise'
Dialog = require '../tutor-dialog'
{ExercisePreview} = require 'openstax-react-components'
ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'

ExerciseCard = React.createClass

  getInitialState: -> {}

  propTypes:
    exercise:    React.PropTypes.object.isRequired
    isExcluded:  React.PropTypes.bool
    interactive: React.PropTypes.bool
    onDetailsClick: React.PropTypes.func

  onExerciseToggle: (ev) ->
    @props.onExerciseToggle(@props.exercise, not @props.isExcluded)

  toggleFeedbackDisplay: ->
    @setState(isShowingFeedback: not @state.isShowingFeedback)

  render: ->

    <ExercisePreview
      className='exercise-card'
      isVerticallyTruncated={not @props.interactive}
      displayFeedback={@state.isShowingFeedback}
      onDetailsClick={@props.onDetailsClick}
      onSelection={@onExerciseToggle unless @props.interactive}
      isSelected={@props.isExcluded}

      {...@props}
    >
    </ExercisePreview>


module.exports = ExerciseCard
