React    = require 'react'
BS       = require 'react-bootstrap'
S = require '../../helpers/string'
TaskHelper = require '../../helpers/task'

module.exports = React.createClass
  displayName: 'LateIcon'
  propTypes:
    task: React.PropTypes.shape(
      due_at:          React.PropTypes.string
      last_worked_at:  React.PropTypes.string
      type:            React.PropTypes.string
    ).isRequired

  render: ->
    status = TaskHelper.getLateness(@props.task)
    return null unless status.is_late

    msg = S.capitalize(@props.task.type) + ' was worked ' + status.how_late + ' late'

    tooltip = <BS.Tooltip>{msg}</BS.Tooltip>
    <BS.OverlayTrigger placement='top' overlay={tooltip}>
      <i className="late"/>
    </BS.OverlayTrigger>
