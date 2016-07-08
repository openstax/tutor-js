_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
WindowHelpers = require '../helpers/window'

{CourseListingActions, CourseListingStore} = require '../flux/course-listing'
{RefreshButton} = require 'openstax-react-components'
EmptyCourses    = require './course-listing/empty'
CourseDataMixin = require './course-data-mixin'

# Called once the store is loaded
# checks the course and roles and will redirect if there is only a single course and role
DisplayOrRedirect = (transition, callback) ->
  courses = CourseListingStore.allCourses() or []
  [course] = courses
  if courses.length is 1
    roleType = courses[0].roles[0].type
    conceptCoach = courses[0].is_concept_coach

    if roleType is 'teacher'
      view = if conceptCoach then 'cc-dashboard' else 'taskplans'
    else if roleType is 'student'
      view = 'viewStudentDashboard'
    else
      throw new Error("BUG: Unrecognized role type #{roleType}")

    transition.redirect(view, {courseId: _.first(courses).id}) if view
  callback()


CourseListing = React.createClass
  displayName: 'CourseListing'

  contextTypes:
    router: React.PropTypes.func

  mixins: [CourseDataMixin]

  statics:
    # Called before the Router mounts and renders the component
    # Uses the callback to delay rendering until the CourseListingStore is loaded
    # and then calls DisplayOrRedirect above to perhaps redirect to a different component
    willTransitionTo: (transition, params, query, callback) ->
      if CourseListingStore.isFailed()
        callback()
      else if not CourseListingStore.isLoaded()
        CourseListingActions.load() unless CourseListingStore.isLoading()
        CourseListingStore.once 'failed', callback
        CourseListingStore.once 'loaded', ->
          DisplayOrRedirect(transition, callback)
      else
        DisplayOrRedirect(transition, callback)

  renderCourses: (courses) ->
    _.map courses, (course) =>
      {id:courseId, name, roles, is_concept_coach:isConceptCoach} = course
      isStudent = _.find roles, (role) -> role.type is 'student'
      isTeacher = _.find roles, (role) -> role.type is 'teacher'

      if isTeacher
        if courseLink?
          altLink = <Router.Link
            className='tutor-course-alt-link'
            to='taskplans'
            params={{courseId}}>View as Teacher</Router.Link>
        else
          to = if isConceptCoach then 'cc-dashboard' else 'taskplans'
          courseLink = <Router.Link
            className='tutor-course-item'
            to={to}
            params={{courseId}}>{course.name}</Router.Link>
      else if isStudent
        if isConceptCoach
          courseLink = <a className='tutor-course-item' href={course.webview_url}>
            {course.name}
            </a>
        else
          courseLink = <Router.Link
            className='tutor-course-item'
            to='viewStudentDashboard'
            params={{courseId}}>{course.name}</Router.Link>
      else
        console.warn?("BUG: User is not a teacher or a student on course id: #{course.id}")
        return null
      courseDataProps = @getCourseDataProps(courseId)
      <BS.Row key="course-#{courseId}">
        <BS.Col {...courseDataProps} className='tutor-booksplash-course-item' xs={12}>
          {courseLink}
          {altLink}
        </BS.Col>
      </BS.Row>

  render: ->
    courses = CourseListingStore.allCourses() or []
    body = if courses.length
      <div className='-course-list'>{@renderCourses(courses)}</div>
    else
      <EmptyCourses />

    unless CourseListingStore.isLoaded()
      refreshBtn = <RefreshButton/>

    <div className='course-listing '>
      {body}
      {refreshBtn}
    </div>

module.exports = {CourseListing}
