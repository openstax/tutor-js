React = require 'react'
LoadableItem = require '../loadable-item'
Name = require '../name'
{ScoresStore, ScoresActions} = require '../../flux/scores'

ViewingAsStudentName = React.createClass
  displayName: 'ViewingAsStudentName'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    className: React.PropTypes.string

  render: ->
    {courseId, taskId, className} = @props
    studentName = null

    className += ' task-student'
    student = ScoresStore.getStudentOfTask(courseId, taskId)

    studentName = <div className={className}>
      <Name {...student} />
    </div> if student?

    studentName

ViewingAsStudentNameShell = React.createClass
  displayName: 'ViewingAsStudentNameShell'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  render: ->
    {courseId} = @props

    <LoadableItem
      id={courseId}
      store={ScoresStore}
      actions={ScoresActions}
      renderItem={=> <ViewingAsStudentName {...@props}/>}
    />

module.exports = {ViewingAsStudentName, ViewingAsStudentNameShell}
