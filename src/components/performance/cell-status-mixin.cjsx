React = require 'react'
Router = require 'react-router'
LateIcon = require './late-icon'

module.exports = {

  propTypes:
    courseId: React.PropTypes.string.isRequired

    task: React.PropTypes.shape(
      status:          React.PropTypes.string
      due_at:          React.PropTypes.string
      last_worked_at:  React.PropTypes.string
      type:            React.PropTypes.string
    ).isRequired

    student: React.PropTypes.shape(
      name: React.PropTypes.string
      role: React.PropTypes.number
    ).isRequired

  isLate: ->
    new Date(@props.task.last_worked_at) > new Date(@props.task.due_at)

  renderLink: ({message}) ->
    <Router.Link className={"task-result #{@props.task.type}"} to='viewTaskStep'
      params={courseId: @props.courseId, id: @props.task.id, stepIndex: 1}>
      <span>{message}</span>
      {<LateIcon {...@props}/> if @isLate()}
    </Router.Link>

}
