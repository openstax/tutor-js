React = require 'react'
extend = require 'lodash/extend'
{Redirect, Link} = require 'react-router-dom'

TutorRouter = require '../helpers/router'
{default: InvalidPage} = require '../components/invalid-page'

{default: CCStudentRedirect}       = require '../components/cc-student-redirect'
{default: StudentDashboardShell} = require '../components/student-dashboard'
{default: WarningModal} = require '../components/warning-modal'
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
      return (
        <WarningModal
          title="Sorry, you can’t access this course"
          message="You are no longer a student in this course. Please contact your instructor if you are still enrolled in this course and need to be re-added."
        />
      )
    unless props.match.isExact
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
