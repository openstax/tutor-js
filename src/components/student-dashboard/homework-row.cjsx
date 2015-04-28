React    = require 'react'
BS       = require 'react-bootstrap'
moment   = require 'moment'
EventRow = require './event-row'
{TimeStore} = require '../../flux/time'
_ = require 'underscore'

isStepComplete = (step) -> step.is_completed

module.exports = React.createClass
  displayName: 'HomeworkRow'

  propTypes:
    event: React.PropTypes.object.isRequired

  viewFeedback: ->
    alert "TODO: View feedback for task ID: #{@props.event.id} in course ID: #{@props.courseId}"

  viewRecovery: ->
    alert "TODO: View recovery for task ID: #{@props.event.id} in course ID: #{@props.courseId}"

  recoveryLinks: ->
    if @props.event.is_complete
      <span> | <a
        onClick={@viewFeedback}>view feedback</a> | <a
        onClick={@viewRecovery}>recover credit</a>
      </span>
    else
      <span/>

  render: ->
    event = @props.event
    feedback = if event.correct_exercise_count
      "#{event.correct_exercise_count}/#{event.exercise_count} correct"
    else
      "#{event.complete_exercise_count}/#{event.exercise_count} complete"

    <EventRow feedback={feedback} event=event cssClass="homework">
        {event.title}{@recoveryLinks()}
    </EventRow>
