React    = require 'react'
BS       = require 'react-bootstrap'
moment   = require 'moment'
EventRow = require './event-row'
{TimeStore} = require '../../flux/time'
_ = require 'underscore'
S = require '../../helpers/string'
isStepComplete = (step) -> step.is_completed

module.exports = React.createClass
  displayName: 'HomeworkRow'

  propTypes:
    event: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInfoIcon: (event) ->
    unless event.complete_exercise_count is event.exercise_count
      due = moment(event.due_at)
      now = TimeStore.getNow()
      # use 'day' granularity for checking if the due date is today or after today
      status = if due.isSame(now, 'd')
        'incomplete'
      else if due.isBefore(now, 'd')
        'late'
    return null unless status

    tooltip = <BS.Tooltip><b>{S.capitalize(status)}</b></BS.Tooltip>
    <BS.OverlayTrigger placement='right' overlay={tooltip}>
      <i className="info #{status}"/>
    </BS.OverlayTrigger>

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
        {event.title}{@getInfoIcon(event)}
    </EventRow>
