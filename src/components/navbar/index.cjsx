React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'
{ScrollListenerMixin} = require 'react-scroll-components'

UserName = require './username'
AdminLink = require './admin-link'
CourseName = require './course-name'
SignOut = require './signout'
BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'
{CourseListingActions, CourseListingStore} = require '../../flux/course-listing'

module.exports = React.createClass
  displayName: 'Navigation'

  mixins: [BindStoreMixin]
  bindStore: CourseStore

  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    CourseListingStore.ensureLoaded()

  getInitialState: ->
    course: undefined

  handleCourseChanges: ->
    if @isMounted()
      {courseId} = @context.router.getCurrentParams()

      unless @state.course?.id is courseId
        course = CourseStore.get(courseId)
        @setState({course})

  # Also need to listen to when location finally updates.
  # This is especially crucial for redirect from dashboard because component mounts
  # before location gets fully updated.  If it doesn't listen for when location
  # changes, this component never update it's state with the course in that case.
  addBindListener: ->
    @context.router.getLocation().addChangeListener(@handleCourseChanges)
    CourseListingStore.addChangeListener(@updateAll)

  removeBindListener: ->
    @context.router.getLocation().removeChangeListener(@handleCourseChanges)
    CourseListingStore.removeChangeListener(@updateAll)

  updateAll: -> @setState({})

  bindUpdate: ->
    @handleCourseChanges()

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
      <BS.CollapsibleNav eventKey={0}>
        <BS.Nav navbar>
          <CourseName course={course}/>
        </BS.Nav>
        <BS.Nav right navbar>
          <AdminLink />
          <BS.DropdownButton
            eventKey={1}
            title={<UserName/>}
            ref='navDropDown'>
            {menuItems}
            <BS.MenuItem
              className="signout"
              eventKey={4}
              key='dropdown-item-logout'>
                <SignOut className='btn btn-link btn-xs'>Sign Out</SignOut>
            </BS.MenuItem>
          </BS.DropdownButton>
        </BS.Nav>
      </BS.CollapsibleNav>
    </BS.Navbar>
