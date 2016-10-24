React = require 'react'

TutorLink = require '../link'
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
    <TutorLink className={"task-result status-cell #{@props.className}"} to='viewTask'
      data-assignment-type="#{@props.task.type}"
      params={courseId: @props.courseId, id: @props.task.id}>
      <span>{message}</span>
      <LateIcon {...@props}/>
    </TutorLink>

  getInitialState: ->
    showingLateOverlay: false

  lateOverlayStateChanged: (status) ->
    @props.task.showingLateOverlay = status
    @forceUpdate()

}
