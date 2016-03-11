React = require 'react'
Router = require 'react-router'
LateIcon = require '../late-icon'
TaskHelper = require '../../helpers/task'

module.exports = {

  propTypes:
    courseId: React.PropTypes.string.isRequired

    task: React.PropTypes.shape(
      status:          React.PropTypes.string
      due_at:          React.PropTypes.string
      last_worked_at:  React.PropTypes.string
      type:            React.PropTypes.string
    ).isRequired

  renderLink: ({message}) ->
    <Router.Link className={"task-result scores-cell #{@props.className}"} to='viewTaskStep'
      data-assignment-type="#{@props.task.type}"
      params={courseId: @props.courseId, id: @props.task.id, stepIndex: 1}>
      <span>{message}</span>
      <LateIcon {...@props}/>
    </Router.Link>

}
