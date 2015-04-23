React    = require 'react'
BS       = require 'react-bootstrap'
moment   = require 'moment'
EventRow = require './event-row'
_ = require 'underscore'

isStepComplete = (step) -> step.is_completed

module.exports = React.createClass
  displayName: 'HomeworkRow'

  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    event = @props.event
    feedback = if moment(event.due_at).isBefore() # Past due, show correct/incorrect
      "#{_.all(event.steps, isStepComplete)}/#{event.steps.length} complete"
    else
      "?/? correct" # TODO: needs added to feed or an alternate calculation determined
    <EventRow feedback={feedback} event=event cssClass="homework">
        {event.title} |
        <a>view feedback</a> |
        <a>recover credit</a>
    </EventRow>
