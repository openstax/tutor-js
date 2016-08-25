React    = require 'react'
BS       = require 'react-bootstrap'
S = require '../../helpers/string'
{TimeStore} = require '../../flux/time'
moment   = require 'moment'
TH = require '../../helpers/task'

module.exports = React.createClass
  displayName: 'EventInfoIcon'

  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    due = moment(@props.event.due_at)
    now = TimeStore.getNow()

    return null if due.isAfter(now, 'd') and TH.hasLateWork(@props.event)

    # use 'day' granularity for checking if the due date is today or after today
    status = if due.isSame(now, 'd') then 'incomplete' else 'late'

    tooltip =
      <BS.Tooltip
        id="event-info-icon-#{@props.event.id}">
        <b>{S.capitalize(status)}</b>
      </BS.Tooltip>

    <BS.OverlayTrigger placement='top' overlay={tooltip}>
      <i className="info #{status}"/>
    </BS.OverlayTrigger>
