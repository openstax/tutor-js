React    = require 'react'
BS       = require 'react-bootstrap'
S = require '../../helpers/string'
{TimeStore} = require '../../flux/time'
moment   = require 'moment'

module.exports = React.createClass
  displayName: 'HomeworkRow'
  propTypes:
    event: React.PropTypes.object.isRequired

  isCompleted: ->
    @props.event.complete_exercise_count is @props.event.exercise_count

  render: ->
    due = moment(@props.event.due_at)
    now = TimeStore.getNow()
    return null if @isCompleted() or due.isAfter(now, 'd')

    # use 'day' granularity for checking if the due date is today or after today
    status = if due.isSame(now, 'd') then 'incomplete' else 'late'

    tooltip = <BS.Tooltip><b>{S.capitalize(status)}</b></BS.Tooltip>
    <BS.OverlayTrigger placement='right' overlay={tooltip}>
      <i className="info #{status}"/>
    </BS.OverlayTrigger>
