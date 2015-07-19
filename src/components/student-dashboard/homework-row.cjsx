React    = require 'react'
BS       = require 'react-bootstrap'
moment   = require 'moment'
_ = require 'underscore'

{TimeStore} = require '../../flux/time'
EventRow = require './event-row'

module.exports = React.createClass
  displayName: 'HomeworkRow'

  propTypes:
    event: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  render: ->
    event = @props.event
    feedback = if event.correct_exercise_count?
      "#{event.correct_exercise_count}/#{event.exercise_count} correct"
    else
      "#{event.complete_exercise_count}/#{event.exercise_count} answered"
    # In the future, the backend will signal whether the event has recovery
    # and feedback available and whether or not the student has already
    # accessed it.
    # For now we assume if the event's compete and it's not on the current week it can be recovered
    recoverable = event.complete and moment(event.due_at).startOf('isoweek').add(1, 'week').isBefore(TimeStore.getNow())
    <EventRow {...@props} feedback={feedback} className='homework'>
      {event.title}
    </EventRow>
