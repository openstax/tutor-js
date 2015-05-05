React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

CourseName = React.createClass
  displayName: 'CourseName'

  mixins: [BindStoreMixin]

  componentWillMount: ->
    unless @state.course?
      @_addListener()
      CurrentUserActions.loadAllCourses()

  getInitialState: ->
    course: undefined

  bindUpdate: ->
    {courseId} = @props
    course = CourseStore.get(courseId)
    @setState({course}) if course

  bindStore: CourseStore

  render: ->
    {course} = @state
    coursename = null

    if course
      coursename = <Router.Link
        to='viewStudentDashboard'
        params={{courseId: course.id}}
        className='navbar-brand'>
        {course.name}
      </Router.Link>

    coursename

module.exports = CourseName
