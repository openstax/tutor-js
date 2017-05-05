React = require 'react'
extend = require 'lodash/extend'
{Redirect, Link} = require 'react-router'

TutorRouter = require '../helpers/router'
{default: InvalidPage} = require '../components/invalid-page'

TeacherTaskPlans        = require '../components/task-plan/teacher-task-plans-listing'
{default: CCStudentRedirect}       = require '../components/cc-student-redirect'
{StudentDashboardShell} = require '../components/student-dashboard'
CCDashboard = require '../components/cc-dashboard'
{CourseStore} = require '../flux/course'

MatchForTutor = require '../components/match-for-tutor'

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
      return <MatchForTutor {...props} />

    if CourseStore.isTeacher(courseId)
      if CourseStore.isConceptCoach(courseId)
        <CCDashboard  courseId={courseId} {...props} />
      else
        <Redirect to={{
          pathname: TutorRouter.makePathname('viewTeacherDashboard', props.params)
          query: TutorRouter.currentQuery()
        }}/>
    else
      if CourseStore.isConceptCoach(courseId)
        <CCStudentRedirect courseId={courseId} />
      else
        <StudentDashboardShell courseId={courseId} {...props} />
