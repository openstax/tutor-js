React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

UserName = require './username'
CourseName = require './course-name'
BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'Navigation'

  mixins: [BindStoreMixin]

  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    unless CurrentUserStore.isCoursesLoaded()
      CurrentUserActions.loadAllCourses()

  getInitialState: ->
    course: undefined

  handleCourseChanges: ->
    if @isMounted()
      {courseId} = @context.router.getCurrentParams()

      unless @state.course?.id.toString() is courseId
        course = CourseStore.get(courseId)
        @setState({course})

  # Also need to listen to when location finally updates.
  # This is especially crucial for redirect from dashboard because component mounts
  # before location gets fully updated.  If it doesn't listen for when location
  # changes, this component never update it's state with the course in that case.
  addBindListener: ->
    @context.router.getLocation().addChangeListener(@handleCourseChanges)

  removeBindListener: ->
    @context.router.getLocation().removeChangeListener(@handleCourseChanges)

  bindUpdate: ->
    @handleCourseChanges()

  bindStore: CourseStore

  logout: -> CurrentUserActions.logout()

  transitionToMenuItem: (routeName, params) ->
    @context.router.transitionTo(routeName, params)

  renderMenuItems: (courseId) ->
    menuRoutes = CurrentUserStore.getMenuRoutes(courseId)

    menuItems = _.map menuRoutes, (route, index) =>
      isActive = @context.router.isActive(route.name, {courseId})
      className = 'active' if isActive
      # TODO
      # https://github.com/react-bootstrap/react-router-bootstrap
      # Requires classname as a dependency.  I'm guessing that's not in alpha.
      <BS.MenuItem
        key="dropdown-item-#{index}"
        onSelect={@transitionToMenuItem.bind(@, route.name, {courseId})}
        className={className}
        eventKey={index + 2}>{route.label}</BS.MenuItem>

    if menuItems.length
      menuItems.push(<BS.MenuItem divider key='dropdown-item-divider'/>)

    menuItems

  render: ->
    {course} = @state
    {courseId} = @context.router.getCurrentParams()
    menuItems = @renderMenuItems(courseId) if courseId

    brand = <Router.Link to='dashboard' className='navbar-brand'>
              <i className='ui-brand-logo'></i>
            </Router.Link>

    <BS.Navbar brand={brand} toggleNavKey={0} fixedTop fluid>
      <BS.CollapsableNav eventKey={0}>
        <BS.Nav navbar>
          <CourseName course={course}/>
        </BS.Nav>
        <BS.Nav right navbar>
          <BS.DropdownButton
            eventKey={1}
            title={<UserName/>}
            ref='navDropDown'>
            {menuItems}
            <BS.MenuItem
              eventKey={4}
              onClick={@logout}
              key='dropdown-item-logout'>Sign Out!</BS.MenuItem>
          </BS.DropdownButton>
        </BS.Nav>
      </BS.CollapsableNav>
    </BS.Navbar>
