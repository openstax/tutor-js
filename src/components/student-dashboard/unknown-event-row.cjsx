React    = require 'react'
BS       = require 'react-bootstrap'
EventRow = require './event-row'

module.exports = React.createClass
  displayName: 'UnknownEventRow'

  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    <EventRow feedback="" {...@props} cssClass="reading">
        {@props.event.title}
    </EventRow>
