React    = require 'react'
BS       = require 'react-bootstrap'
S = require '../../helpers/string'
{TimeStore} = require '../../flux/time'
moment   = require 'moment'

module.exports = React.createClass
  displayName: 'EventInfoIcon'

  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    {event} = @props

    now   = TimeStore.getNow()
    dueAt = moment(event.due_at)
    isIncomplete = event.complete_exercise_count isnt event.exercise_count
    pastDue      = event.type is 'homework' and dueAt.isBefore(now, 'd')
    workedLate   = moment(event.last_worked_at).isAfter(dueAt)

    return null unless workedLate or (pastDue and isIncomplete)

    # use 'day' granularity for checking if the due date is today or after today
    status = if dueAt.isSame(now, 'd') then 'incomplete' else 'late'

    tooltip =
      <BS.Tooltip id="event-info-icon-#{event.id}">
        <b>{S.capitalize(status)}</b>
      </BS.Tooltip>

    <BS.OverlayTrigger placement='top' overlay={tooltip}>
      <i className="info #{status}"/>
    </BS.OverlayTrigger>
