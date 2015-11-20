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
    conceptCoach = courses[0].is_concept_coach

    if roleType is 'student'
      type = 'viewStudentDashboard'
    else if roleType is 'teacher' and not conceptCoach
      type = 'taskplans'
    else if roleType is 'teacher' and conceptCoach
      type = 'cc-dashboard'
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

  renderCourseData: (course, courseDataProps) ->
    <BS.Panel {...courseDataProps} className='tutor-course-item'>
      <div className='book-image'></div>
      <div className='course-info'>
        <div className='name'>{course.name}</div>
        <div className='institution'>University of Georgia</div>
        <div className='code'>
          <div className='heading'>Course Code</div>
          GBB121R
        </div>
        <div className='instructors'>
          <div className='heading'>Instructors</div>
          <ul>
            <li>Jose Padilla</li>
            <li>Theresa Chapman</li>
            <li>Lily Bart</li>
          </ul>
        </div>
      </div>
    </BS.Panel>

  renderCourses: (courses) ->
    _.map courses, (course) =>
      {id:courseId, name, roles} = course
      isStudent = _.find roles, (role) -> role.type is 'student'
      isTeacher = _.find roles, (role) -> role.type is 'teacher'
      courseDataProps = @getCourseDataProps(courseId)

      if isStudent
        courseLink = <Router.Link
          className='tutor-course-item-link'
          to='viewStudentDashboard'
          params={{courseId}}>{@renderCourseData(course, courseDataProps)}</Router.Link>

      if isTeacher
        courseLink = <Router.Link
          className='tutor-course-item-link'
          to='taskplans'
          params={{courseId}}>{@renderCourseData(course, courseDataProps)}</Router.Link>
      
      <BS.Col className='tutor-booksplash-course-item' xs={12}>
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
