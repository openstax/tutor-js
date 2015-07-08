React = require 'react'
LoadableItem = require '../loadable-item'

{PerformanceStore, PerformanceActions} = require '../../flux/performance'

ViewingAsStudentName = React.createClass
  displayName: 'ViewingAsStudentName'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  render: ->
    {courseId, taskId} = @props
    studentName = null

    student = PerformanceStore.getStudentOfTask(courseId, taskId)

    studentName = <div className='task-student details'>
      {student.name}
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