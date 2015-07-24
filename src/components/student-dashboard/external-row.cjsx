React    = require 'react'
BS       = require 'react-bootstrap'
moment   = require 'moment'
_ = require 'underscore'

{TimeStore} = require '../../flux/time'
EventRow = require './event-row'

module.exports = React.createClass
  displayName: 'ExternalRow'

  propTypes:
    event: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  render: ->
    event = @props.event
    feedback = switch
      when @props.event.complete then 'Clicked'
      else 'Not started'
    <EventRow {...@props} feedback={feedback} className='external'>
      {event.title}
    </EventRow>