React    = require 'react'
BS       = require 'react-bootstrap'
EventRow = require './event-row'
_ = require 'underscore'

isStepComplete = (step) -> step.is_completed

module.exports = React.createClass
  displayName: 'ReadingRow'

  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    event = @props.event
    feedback = switch
      when _.all(event.steps, isStepComplete) then "Complete"
      when _.any(event.steps, isStepComplete) then "In progress"
      else "Not started"
    <EventRow feedback={feedback} event=event cssClass="reading">
        {event.title} | <a>reference view</a>
    </EventRow>
