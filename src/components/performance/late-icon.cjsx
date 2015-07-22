React    = require 'react'
BS       = require 'react-bootstrap'
S = require '../../helpers/string'
moment = require 'moment'

module.exports = React.createClass
  displayName: 'LateIcon'
  propTypes:
    task: React.PropTypes.shape(
      due_at:          React.PropTypes.string
      last_worked_at:  React.PropTypes.string
      type:            React.PropTypes.string
    ).isRequired

  render: ->
    due = moment(@props.task.due_at)
    msg = S.capitalize(@props.task.type) + ' was worked ' + due.from(@props.task.last_worked_at, true) + ' late'

    tooltip = <BS.Tooltip>{msg}</BS.Tooltip>
    <BS.OverlayTrigger placement='top' overlay={tooltip}>
      <i className="late"/>
    </BS.OverlayTrigger>
