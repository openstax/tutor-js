_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseListingActions, CourseListingStore} = require '../flux/course-listing'
RefreshButton = require './refresh-button'

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
    _.map courses, (course) ->
      {id:courseId, name, roles} = course
      isStudent = _.find roles, (role) -> role.type is 'student'
      isTeacher = _.find roles, (role) -> role.type is 'teacher'
      footer = []
      if isStudent or not isTeacher # HACK since a student does not currently have a role
        footer.push(
          <Router.Link
            className='btn btn-link -student'
            to='viewStudentDashboard'
            params={{courseId}}>Task List (Student)</Router.Link>)
      if isTeacher
        footer.push(
          <Router.Link
            className='btn btn-link -teacher'
            to='taskplans'
            params={{courseId}}>
            Plan List (Teacher)
          </Router.Link>)
      footer = <span className='-footer-buttons'>{footer}</span>
      <BS.Panel header={name} footer={footer} bsStyle='primary'>
        <h1>Course: "{name}" Dashboard!</h1>
      </BS.Panel>

  render: ->
    courses = CourseListingStore.allCourses() or []
    body = if courses.length
      <div className='-course-list'>{@renderCourses(courses)}</div>
    else
      <div className='-course-list-empty'>No Courses</div>

    unless CourseListingStore.isLoaded()
      refreshBtn = <RefreshButton/>

    <div className='course-listing '>
      {body}
      {refreshBtn}
    </div>

module.exports = {CourseListing}
