_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseListingActions, CourseListingStore} = require '../flux/course-listing'
RefreshButton = require './buttons/refresh-button'

CourseDataMixin = require './course-data-mixin'

# Called once the store is loaded
# checks the course and roles and will redirect if there is only a single course and role
DisplayOrRedirect = (transition, callback) ->
  courses = CourseListingStore.allCourses() or []
  [course] = courses
  if courses.length is 1 and course.roles?.length is 1
    roleType = courses[0].roles[0].type
    type = switch roleType
      when 'student' then 'viewStudentDashboard'
      when 'teacher' then 'taskplans'
      else
        throw new Error("BUG: Unrecognized role type #{roleType}")
    transition.redirect(type, {courseId: _.first(courses).id})
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

  renderCourseData: (course) ->
    <div>{course.name}</div>

  renderCourses: (courses) ->
    _.map courses, (course) =>
      {id:courseId, name, roles} = course
      isStudent = _.find roles, (role) -> role.type is 'student'
      isTeacher = _.find roles, (role) -> role.type is 'teacher'

      if isStudent
        courseLink = <Router.Link
          className='tutor-course-item'
          to='viewStudentDashboard'
          params={{courseId}}>{@renderCourseData(course)}</Router.Link>

      if isTeacher
        courseLink = <Router.Link
          className='tutor-course-item'
          to='taskplans'
          params={{courseId}}>{@renderCourseData(course)}</Router.Link>

      courseDataProps = @getCourseDataProps(courseId)
      <BS.Col {...courseDataProps} className='tutor-booksplash-course-item' xs={12}>
        {courseLink}
      </BS.Col>

  render: ->
    courses = CourseListingStore.allCourses() or []
    body = if courses.length
      <div className='-course-list'>{@renderCourses(courses)}</div>
    else
      <div className='-course-list-empty'>No Courses</div>

    unless CourseListingStore.isLoaded()
      refreshBtn = <RefreshButton/>

    <BS.Panel className='course-listing'>
      {body}
      {refreshBtn}
    </BS.Panel>

module.exports = {CourseListing}
