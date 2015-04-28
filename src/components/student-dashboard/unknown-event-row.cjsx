React    = require 'react'
BS       = require 'react-bootstrap'
EventRow = require './event-row'

module.exports = React.createClass
  displayName: 'UnknownEventRow'

  propTypes:
    event: React.PropTypes.object.isRequired
    courseId: React.PropTypes.any.isRequired

  render: ->
    <EventRow feedback="" {...@props} className="unknown">
        {@props.event.title}
    </EventRow>
