React = require 'react'
extend = require 'lodash/extend'
{Redirect, Link} = require 'react-router'

InvalidPage = require '../components/invalid-page'

TeacherTaskPlans        = require '../components/task-plan/teacher-task-plans-listing'
CCStudentRedirect       = require '../components/cc-student-redirect'
{StudentDashboardShell} = require '../components/student-dashboard'


{CourseStore} = require '../flux/course'

module.exports =
  studentOrTeacher: (StudentComponent, TeacherComponent, defaultProps = {} ) ->
    (props) ->
      {courseId} = props.params
      componentProps = extend(props, defaultProps)
      if CourseStore.isTeacher(courseId)
        <TeacherComponent courseId={courseId} {...componentProps} />
      else
        <StudentComponent courseId={courseId} {...componentProps} />


  dashboard: (props) ->
    {courseId} = props.params
    extend(props, {courseId})
    course = CourseStore.get(courseId)

    unless course
      return <InvalidPage message="course was not found" />

    if CourseStore.isTeacher(courseId)
      if CourseStore.isConceptCoach(courseId)
        <TeacherComponent courseId={courseId} {...props} />
      else
        <TeacherTaskPlans {...props} />
    else
      if CourseStore.isConceptCoach(courseId)
        <CCStudentRedirect {...props} />
      else
        <StudentDashboardShell courseId={courseId} {...props} />
