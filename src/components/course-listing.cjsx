_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
AK =  require '../router'
Loadable = require './loadable'
BindStoreMixin = require './bind-store-mixin'

{CourseListingActions, CourseListingStore} = require '../flux/course-listing'

DisplayOrRedirect = (transition, callback) ->
  courses = CourseListingStore.allCourses() or []
  if courses.length is 1 and courses[0].roles?.length is 1
    roleType = courses[0].roles[0].type
    type = switch roleType
      when 'student' then 'viewStudentDashboard'
      when 'teacher' then 'taskplans'
      else
        throw new Error("BUG: Unrecognized role type #{roleType}")
    transition.redirect('viewStudentDashboard', {courseId: 1})
  callback()


CourseListing = React.createClass
  displayName: 'CourseListing'

  contextTypes:
    router: React.PropTypes.func

  mixins: [ Router.Navigation ]

  statics:
    willTransitionTo: (transition, params, query, callback) ->
      unless CourseListingStore.isLoaded() or CourseListingStore.isLoading()
        CourseListingActions.load()
        fn = ->
          CourseListingStore.off('load', fn)
          DisplayOrRedirect(transition, callback)
        CourseListingStore.on('loaded', fn)
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
    <div className='course-listing '>
      {body}
    </div>

module.exports = {CourseListing}
