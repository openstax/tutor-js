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

  viewReference: (e) ->
    alert "TODO: View Reference for task ID: #{@props.event.id} in course ID: #{@props.courseId}"
    e.stopPropagation() # needed to stop event from propagating the click up to the event click handler

  render: ->
    feedback = switch
      when @props.event.complete then "Complete"
      when @props.event.exercise_count > 0 then "In progress"
      else "Not started"
    <EventRow {...@props} feedback={feedback} className="reading">
      { @props.event.title} | <span className="-actions">
        <a className="-reference" onClick={@viewReference}>reference view</a>
      </span>
    </EventRow>
