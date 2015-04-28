React    = require 'react'
BS       = require 'react-bootstrap'
EventRow = require './event-row'
_ = require 'underscore'

isStepComplete = (step) -> step.is_completed

module.exports = React.createClass
  displayName: 'ReadingRow'

  propTypes:
    event: React.PropTypes.object.isRequired
    courseId: React.PropTypes.any.isRequired

  viewReference: ->
    alert "TODO: View Reference for task ID: #{@props.event.id} in course ID: #{@props.courseId}"

  render: ->
    event = @props.event
    feedback = switch
      when event.complete then "Complete"
      when event.exercise_count > 0 then "In progress"
      else "Not started"
    <EventRow feedback={feedback} event=event cssClass="reading">
        {event.title} | <a onClick={@viewReference}>reference view</a>
    </EventRow>
