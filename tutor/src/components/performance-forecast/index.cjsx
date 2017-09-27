React = require 'react'

Router = require '../../helpers/router'
PerformanceForecast = require '../../flux/performance-forecast'
LoadableItem = require '../loadable-item'
TeacherComponent = require './teacher'
StudentComponent = require './student'
TeacherStudentComponent = require './teacher-student'

{CourseStore} = require '../../flux/course'
{default: Courses} = require '../../models/courses-map'

Student = React.createClass
  displayName: 'PerformanceForecastStudentShell'


  render: ->
    {courseId} = Router.currentParams()
    <LoadableItem
      id={courseId}
      store={PerformanceForecast.Student.store}
      actions={PerformanceForecast.Student.actions}
      renderItem={-> <StudentComponent courseId={courseId} />}
    />


# The teacher student store depends on both the
# scores report store as well as the teacher student learning guide
TeacherStudent = React.createClass
  displayName: 'PerformanceForecastTeacherStudentShell'

  render: ->
    {courseId, roleId} = Router.currentParams()
    <TeacherStudentComponent courseId={courseId} roleId={roleId}/>


Teacher = React.createClass
  displayName: 'PerformanceForecastTeacherShell'

  render: ->
    {courseId} = Router.currentParams()
    <LoadableItem
      id={courseId}
      store={PerformanceForecast.Teacher.store}
      actions={PerformanceForecast.Teacher.actions}
      renderItem={-> <TeacherComponent courseId={courseId} />}
    />

Guide = React.createClass
  displayName: 'PerformanceForecastGuide'

  render: ->
    {courseId, roleId} = Router.currentParams()
    isTeacher = CourseStore.isTeacher(courseId)
    if roleId? and isTeacher
      <TeacherStudent />
    else if isTeacher
      <Teacher />
    else
      <Student />


module.exports = {Teacher, TeacherStudent, Student, Guide}
