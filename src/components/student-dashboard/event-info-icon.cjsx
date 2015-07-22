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
    due = moment(@props.event.due_at)
    now = TimeStore.getNow()

    return null if @props.event.type isnt 'homework' or
      @props.event.complete_exercise_count is @props.event.exercise_count or
      due.isAfter(now, 'd')

    # use 'day' granularity for checking if the due date is today or after today
    status = if due.isSame(now, 'd') then 'incomplete' else 'late'

    tooltip = <BS.Tooltip><b>{S.capitalize(status)}</b></BS.Tooltip>
    <BS.OverlayTrigger placement='top' overlay={tooltip}>
      <i className="info #{status}"/>
    </BS.OverlayTrigger>
