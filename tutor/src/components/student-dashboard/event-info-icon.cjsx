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

    # TODO this is naive and not timezone aware.  As a hotfix, this should suffice.
    now   = moment(TimeStore.getNow())
    dueAt = moment(event.due_at)
    isIncomplete = event.complete_exercise_count isnt event.exercise_count
    pastDue      = event.type is 'homework' and dueAt.isBefore(now)
    isDueToday   = now.isBetween(dueAt.clone().subtract(1, 'day'), dueAt)

    unless @props.event.type is 'homework' and ( pastDue or (isIncomplete and isDueToday))
      return null

    status = if isDueToday then 'incomplete' else 'late'

    tooltip =
      <BS.Tooltip id="event-info-icon-#{event.id}">
        <b>{S.capitalize(status)}</b>
      </BS.Tooltip>

    <BS.OverlayTrigger placement='top' overlay={tooltip}>
      <i className="info #{status}"/>
    </BS.OverlayTrigger>
