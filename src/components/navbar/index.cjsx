React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'
{ScrollListenerMixin} = require 'react-scroll-components'

UserName = require './username'
AdminLink = require './admin-link'
AccountLink = require './account-link'
CourseName = require './course-name'
LogOut = require './logout'
BindStoreMixin = require '../bind-store-mixin'
ServerErrorMonitoring = require './server-error-monitoring'
BrowseTheBook = require '../buttons/browse-the-book'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'
{CourseListingActions, CourseListingStore} = require '../../flux/course-listing'

module.exports = React.createClass
  displayName: 'Navigation'

  mixins: [BindStoreMixin]
  bindStore: CurrentUserStore

  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    CurrentUserStore.ensureLoaded()
    CourseListingStore.ensureLoaded()

  getInitialState: ->
    course = @getCourseFromParams()
    {course}

  getCourseFromParams: ->
    {courseId} = @context.router.getCurrentParams()
    CourseStore.get(courseId) if courseId?

  handleCourseChanges: ->
    if @isMounted()
      course = @getCourseFromParams()
      unless _.isEqual(course, @state.course)
        @setState({course})

  componentDidUpdate: ->
    @handleCourseChanges()

  componentDidMount: ->
    CourseStore.on('course.loaded', @handleCourseChanges)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @handleCourseChanges)

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
        onSelect={@transitionToMenuItem.bind(@, route.name, route.params)}
        className={className}
        eventKey={index + 2}>{route.label}</BS.MenuItem>

    menuItems.push <li><BrowseTheBook unstyled={true} courseId={courseId} /></li>
    menuItems.push <BS.MenuItem divider key='dropdown-item-divider'/>
    menuItems

  render: ->
    {course} = @state
    {courseId} = @context.router.getCurrentParams()
    menuItems = @renderMenuItems(courseId) if courseId

    brand = <Router.Link to='dashboard' className='navbar-brand'>
              <i className='ui-brand-logo'></i>
            </Router.Link>

    <BS.Navbar brand={brand} toggleNavKey={0} fixedTop fluid>
      <BS.CollapsibleNav eventKey={0}>
        <BS.Nav navbar>
          <CourseName course={course}/>
        </BS.Nav>
        <BS.Nav right navbar>
          <AdminLink />
          <BS.DropdownButton
            eventKey={1}
            className='-hamburger-menu'
            title={<UserName/>}
            ref='navDropDown'>
            {menuItems}
            <AccountLink key='accounts-link' />
            <BS.MenuItem target='_blank' href={CurrentUserStore.getHelpLink(courseId)}>Get Help</BS.MenuItem>
            <BS.MenuItem
              className="logout"
              eventKey={4}
              key='dropdown-item-logout'>
                <LogOut className='btn btn-link btn-xs'>Log Out</LogOut>
            </BS.MenuItem>
          </BS.DropdownButton>
        </BS.Nav>
      </BS.CollapsibleNav>
      <ServerErrorMonitoring />
    </BS.Navbar>
