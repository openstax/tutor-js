React = require 'react'
{ Link } = require 'react-router'
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
    <Link className={"task-result scores-cell #{@props.className}"}
      to="/courses/#{@props.courseId}/tasks/#{@props.task.id}/steps/1"
      data-assignment-type="#{@props.task.type}">
      <span>{message}</span>
      <LateIcon {...@props}/>
    </Link>

}
