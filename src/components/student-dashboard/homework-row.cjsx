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

  actionLinks: ->
    <span className="-actions"> | <a
      onClick={@viewFeedback} className="-feedback">view feedback</a> | <a
      onClick={@viewRecovery} className="-recover">recover credit</a>
    </span>

  render: ->
    event = @props.event
    feedback = if event.correct_exercise_count
      "#{event.correct_exercise_count}/#{event.exercise_count} correct"
    else
      "#{event.complete_exercise_count}/#{event.exercise_count} complete"
    # In the future, the backend will signal whether the event has recovery
    # and feedback available and whether or not the student has already
    # accessed it.  For now we assume if the event's compete it can be recovered
    recoverable = event.complete
    <EventRow feedback={feedback} event=event className="homework">
        {event.title}{@actionLinks() if recoverable}
    </EventRow>
