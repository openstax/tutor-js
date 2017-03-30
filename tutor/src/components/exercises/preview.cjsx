React = require 'react'

{ExercisePreview} = require 'shared'
{default: TourAnchor} = require '../tours/anchor'
BindStoreMixin = require '../bind-store-mixin'

# Wraps the ExercisePreview component so it will re-render in
# response to a store event
ExercisePreviewWrapper = React.createClass

  propTypes:
    exercise:               React.PropTypes.object.isRequired
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    onExerciseToggle:       React.PropTypes.func.isRequired
    getExerciseIsSelected:  React.PropTypes.func.isRequired
    getExerciseActions:     React.PropTypes.func.isRequired
    watchStore:             React.PropTypes.object.isRequired
    watchEvent:             React.PropTypes.string.isRequired

  mixins: [BindStoreMixin]
  bindStore: -> @props.watchStore
  bindEvent: ->
    { watchEvent, exercise } = @props
    "#{watchEvent}#{exercise.id}"

  render: ->
    { exercise } = @props
    <TourAnchor id="exercise-preview">
      <ExercisePreview
        key={exercise.id}
        className='exercise-card'
        isInteractive={false}
        isVerticallyTruncated={true}
        isSelected={@props.getExerciseIsSelected(exercise)}
        exercise={exercise}
        onOverlayClick={@onExerciseToggle}
        overlayActions={@props.getExerciseActions(exercise)}
      />
    </TourAnchor>

module.exports = ExercisePreviewWrapper
