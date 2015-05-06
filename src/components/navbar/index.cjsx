React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

UserName = require './username'
{CourseName, CourseMenuMixin} = require './coursename'
BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'Navigation'

  mixins: [BindStoreMixin, CourseMenuMixin]

  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    unless CurrentUserStore.isCoursesLoaded()
      CurrentUserActions.loadAllCourses()

  getInitialState: ->
    course: undefined

  handleCourseChanges: ->
    {courseId} = @context.router.getCurrentParams()

    unless @state.course?.id.toString() is courseId
      course = CourseStore.get(courseId)
      menuRole = CurrentUserStore.getCourseRole(courseId)
      @setState({course, menuRole})

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

  renderMenuItems: (courseId, menuRole) ->
    menuRoutes = @getMenuRoutes(menuRole)

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
      menuItems.push(<BS.MenuItem divider />)

    menuItems

  render: ->
    {course, menuRole} = @state
    {courseId} = @context.router.getCurrentParams()
    menuItems = @renderMenuItems(courseId, menuRole) if courseId

    brand = <Router.Link to='dashboard' className='navbar-brand'>
              <i className='ui-brand-logo'></i>
            </Router.Link>

    <BS.Navbar brand={brand} fixedTop fluid>
      <CourseName course={course} menuRole={menuRole}/>
      <BS.Nav right>
        <BS.DropdownButton eventKey={1} title={<UserName/>}>
          {menuItems}
          <BS.MenuItem eventKey={4} onClick={@logout}>Sign Out!</BS.MenuItem>
        </BS.DropdownButton>
      </BS.Nav>
    </BS.Navbar>
