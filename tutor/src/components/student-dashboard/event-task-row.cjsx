React    = require 'react'

EventRow = require './event-row'

module.exports = React.createClass
  displayName: 'EventTaskRow'

  propTypes:
    event: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  render: ->
    event = @props.event
    <EventRow feedback='' {...@props} workable={false} eventType='event'>
      {event.title}
    </EventRow>
