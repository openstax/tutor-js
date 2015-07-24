React    = require 'react'
BS       = require 'react-bootstrap'
S = require '../helpers/string'
TaskHelper = require '../helpers/task'

module.exports = React.createClass
  displayName: 'LateIcon'
  propTypes:
    task: React.PropTypes.shape(
      due_at:          React.PropTypes.string
      last_worked_at:  React.PropTypes.string
      type:            React.PropTypes.string
    ).isRequired

    buildLateMessage: React.PropTypes.func

  getDefaultProps: ->
    buildLateMessage: (task, status) ->
      S.capitalize(task.type) + ' was worked ' + status.how_late + ' late'

  render: ->
    status = TaskHelper.getLateness(@props.task)
    return null unless status.is_late

    msg = @props.buildLateMessage(@props.task, status)

    {className} = @props
    classes = "#{className} late"

    tooltip = <BS.Tooltip>{msg}</BS.Tooltip>
    <BS.OverlayTrigger placement='top' overlay={tooltip}>
      <i className={classes}/>
    </BS.OverlayTrigger>
