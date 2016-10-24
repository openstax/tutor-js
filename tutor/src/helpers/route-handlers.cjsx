React = require 'react'
extend = require 'lodash/extend'
{Redirect, Link} = require 'react-router'

InvalidPage = require '../components/invalid-page'

TeacherTaskPlans        = require '../components/task-plan/teacher-task-plans-listing'
CCStudentRedirect       = require '../components/cc-student-redirect'
{StudentDashboardShell} = require '../components/student-dashboard'
CCDashboard = require '../components/cc-dashboard'
{CourseStore} = require '../flux/course'

RoutingHelper = require './routing'

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
    unless props.isExact
      return <RoutingHelper.component {...props} />

    if CourseStore.isTeacher(courseId)
      if CourseStore.isConceptCoach(courseId)
        <CCDashboard  courseId={courseId} {...props} />
      else
        <TeacherTaskPlans {...props} />
    else
      if CourseStore.isConceptCoach(courseId)
        <CCStudentRedirect {...props} />
      else
        <StudentDashboardShell courseId={courseId} {...props} />
