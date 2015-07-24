React = require 'react'
LoadableItem = require '../loadable-item'

{PerformanceStore, PerformanceActions} = require '../../flux/performance'

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
    student = PerformanceStore.getStudentOfTask(courseId, taskId)

    studentName = <div className={className}>
      {student.first_name} {student.last_name}
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
      store={PerformanceStore}
      actions={PerformanceActions}
      renderItem={=> <ViewingAsStudentName {...@props}/>}
    />

module.exports = {ViewingAsStudentName, ViewingAsStudentNameShell}