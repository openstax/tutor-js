React = require 'react'

PerformanceForecast = require '../../flux/performance-forecast'
LoadableItem = require '../loadable-item'
TeacherComponent = require './teacher'
StudentComponent = require './student'
TeacherStudentComponent = require './teacher-student'
{ScoresStore, ScoresActions} = require '../../flux/scores'

Student = React.createClass
  displayName: 'PerformanceForecastStudentShell'

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={PerformanceForecast.Student.store}
      actions={PerformanceForecast.Student.actions}
      renderItem={-> <StudentComponent courseId={courseId} />}
      isLong={true}
    />


# The teacher student store depends on both the
# scores report store as well as the teacher student learning guide
TeacherStudent = React.createClass
  displayName: 'PerformanceForecastTeacherStudentShell'

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId, roleId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={ScoresStore}
      actions={ScoresActions}
      renderItem={-> <TeacherStudentComponent courseId={courseId} roleId={roleId}/>}
      isLong={true}
    />


Teacher = React.createClass
  displayName: 'PerformanceForecastTeacherShell'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={PerformanceForecast.Teacher.store}
      actions={PerformanceForecast.Teacher.actions}
      renderItem={-> <TeacherComponent courseId={courseId} />}
      isLong={true}
    />

module.exports = {Teacher, TeacherStudent, Student}
