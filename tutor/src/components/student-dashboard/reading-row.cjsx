React    = require 'react'
BS       = require 'react-bootstrap'
EventRow = require './event-row'
_ = require 'underscore'

isStepComplete = (step) -> step.is_completed

module.exports = React.createClass
  displayName: 'ReadingRow'

  propTypes:
    event: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  render: ->
    feedback = switch
      when @props.event.complete then 'Complete'
      when @props.event.complete_exercise_count > 0 then 'In progress'
      else 'Not started'
    <EventRow {...@props} feedback={feedback} className='reading'>
      { @props.event.title}
    </EventRow>
