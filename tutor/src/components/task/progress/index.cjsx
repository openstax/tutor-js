React = require 'react'
{ TaskStore } = require '../../../flux/task'
BS = require 'react-bootstrap'

module.exports = React.createClass
  propTypes:
    taskId: React.PropTypes.string
    stepKey: React.PropTypes.number

  render: ->
    progress = TaskStore.getProgress(@props.taskId, @props.stepKey)
    <div className="reading-task-bar">
      <BS.ProgressBar now={progress} bsStyle="success"/>
    </div>
