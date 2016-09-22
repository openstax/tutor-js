React = require 'react'
{ TaskPanelStore } = require '../../../flux/task-panel'
BS = require 'react-bootstrap'

module.exports = React.createClass
  propTypes:
    taskId: React.PropTypes.string
    stepIndex: React.PropTypes.number

  render: ->
    progress = TaskPanelStore.getProgress(@props.taskId, @props.stepIndex)
    <div className="reading-task-bar">
      <BS.ProgressBar now={progress} bsStyle="success"/>
    </div>
