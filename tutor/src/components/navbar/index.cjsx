React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
_ = require 'underscore'
Router = require '../../helpers/router'

CourseName = require './course-name'
ServerErrorMonitoring = require '../error-monitoring'
UserActionsMenu = require './user-actions-menu'
BookLinks = require './book-links'
CenterControls = require './center-controls'
TutorLink = require '../link'

{CurrentUserActions} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'
{CourseListingStore} = require '../../flux/course-listing'

module.exports = React.createClass
  displayName: 'Navigation'

  componentWillMount: ->
    CourseListingStore.ensureLoaded()

  getInitialState: ->
    course = @getCourseFromParams()
    {course}

  getCourseFromParams: ->
    {courseId} = Router.currentParams()
    CourseStore.get(courseId) if courseId?

  handleCourseChanges: ->
    course = @getCourseFromParams()
    unless _.isEqual(course, @state.course)
      @setState({course})

  collapseNav: ->
    navBar = ReactDOM.findDOMNode(@refs.navBar)
    collapsibleNav = navBar.querySelector('div.navbar-collapse')
    toggleBtn = navBar.querySelector('button.navbar-toggle')
    toggleBtn.click() if collapsibleNav.classList.contains('in')
    return null

  componentDidUpdate: ->
    @handleCourseChanges()

  componentDidMount: ->
    CourseStore.on('course.loaded', @handleCourseChanges)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @handleCourseChanges)

  render: ->
    {course} = @state
    params = Router.currentParams()
    {courseId} = params

    <BS.Navbar fixedTop fluid ref="navBar">
      <BS.Navbar.Header>
        <BS.Navbar.Brand>
          <TutorLink to='listing' className='navbar-brand'>
            <i className='ui-brand-logo'></i>
          </TutorLink>
        </BS.Navbar.Brand>
        <BS.Navbar.Toggle/>
      </BS.Navbar.Header>
      <CenterControls params={params} />
      <BS.Navbar.Collapse>
        <BS.Nav>
          <CourseName course={course}/>
          <BookLinks courseId={courseId} onItemClick={@collapseNav} />
        </BS.Nav>
        <BS.Nav pullRight>
          <UserActionsMenu courseId={courseId} location={@props.location}
            course={@getCourseFromParams()} onItemClick={@collapseNav} />
        </BS.Nav>
      </BS.Navbar.Collapse>
      <ServerErrorMonitoring />
    </BS.Navbar>
