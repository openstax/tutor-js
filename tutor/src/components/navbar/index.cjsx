React = require 'react'
BS = require 'react-bootstrap'
{Link} = require 'react-router'
_ = require 'underscore'

CourseName = require './course-name'
ServerErrorMonitoring = require './server-error-monitoring'
UserActionsMenu = require './user-actions-menu'
BookLinks = require './book-links'
CenterControls = require './center-controls'
{NotificationsBar} = require 'shared'

{CurrentUserActions} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'
{CourseListingStore} = require '../../flux/course-listing'

module.exports = React.createClass
  displayName: 'Navigation'

  contextTypes:
    router: React.PropTypes.object

  componentWillMount: ->
    CourseListingStore.ensureLoaded()

  getInitialState: ->
    course = @getCourseFromParams()
    {course}

  getCourseFromParams: ->
    {courseId} = @props.params or {}
    CourseStore.get(courseId) if courseId?

  handleCourseChanges: ->
    if @isMounted()
      course = @getCourseFromParams()
      unless _.isEqual(course, @state.course)
        @setState({course})

  collapseNav: ->
    navBar = this.refs.navBar.getDOMNode();
    collapsibleNav = navBar.querySelector('div.navbar-collapse');
    toggleBtn = navBar.querySelector('button.navbar-toggle');

    if collapsibleNav.classList.contains('in')
      toggleBtn.click();

    return null

  componentDidUpdate: ->
    @handleCourseChanges()

  componentDidMount: ->
    CourseStore.on('course.loaded', @handleCourseChanges)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @handleCourseChanges)

  render: ->
    {course} = @state
    {courseId} = @props.params or {}

    brand = <Link to='/dashboard' className='navbar-brand'>
              <i className='ui-brand-logo'></i>
            </Link>

    <BS.Navbar fixedTop fluid ref="navBar">
      <CenterControls />
      <BS.Navbar.Brand>
        {brand}
      </BS.Navbar.Brand>
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
      <NotificationsBar />
    </BS.Navbar>
