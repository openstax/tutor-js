React = require 'react'
extend = require 'lodash/extend'
{Redirect, Link} = require 'react-router-dom'

TutorRouter = require '../helpers/router'
{default: InvalidPage} = require '../components/invalid-page'

{default: CCStudentRedirect}       = require '../components/cc-student-redirect'
{default: StudentDashboardShell} = require '../components/student-dashboard'
{default: WarningModal} = require '../components/warning-modal'
{default: Courses} = require '../models/courses-map'
CCDashboard = require '../components/cc-dashboard'
MatchForTutor = require '../components/match-for-tutor'

module.exports =
  studentOrTeacher: (StudentComponent, TeacherComponent, defaultProps = {} ) ->
    (props) ->
      {courseId} = props.params
      componentProps = extend(props, defaultProps)
      if Courses.get(courseId).isTeacher
        <TeacherComponent courseId={courseId} {...componentProps} />
      else
        <StudentComponent courseId={courseId} {...componentProps} />


  dashboard: (props) ->
    {courseId} = props.params

    extend(props, {courseId})
    course = Courses.get(courseId)
    unless course
      return (
        <WarningModal title="Sorry, you can’t access this course">
          You are no longer a student in this course. Please contact your instructor if you are still enrolled in this course and need to be re-added.
        </WarningModal>
      )
    unless props.match.isExact
      return <MatchForTutor {...props} />

    if course.isTeacher
      if course.is_concept_coach
        <CCDashboard  courseId={courseId} {...props} />
      else
        <Redirect to={{
          pathname: TutorRouter.makePathname('viewTeacherDashboard', props.params)
          query: TutorRouter.currentQuery()
        }}/>
    else
      if course.is_concept_coach
        <CCStudentRedirect courseId={courseId} />
      else
        <StudentDashboardShell courseId={courseId} {...props} />
