React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

UserName = require './username'
AccountLink = require './account-link'
BrowseTheBook = require '../buttons/browse-the-book'
BindStoreMixin = require '../bind-store-mixin'
LogOut = require './logout'

{CurrentUserStore} = require '../../flux/current-user'

UserActionsMenu = React.createClass

  mixins: [BindStoreMixin]
  bindStore: CurrentUserStore

  propTypes:
    courseId: React.PropTypes.string

  contextTypes:
    router: React.PropTypes.func

  transitionToMenuItem: (routeName, params) ->
    @context.router.transitionTo(routeName, params)

  componentWillMount: ->
    CurrentUserStore.ensureLoaded()

  renderCourseMenuItem: (route, index) ->
    isActive = @context.router.isActive(route.name, {courseId: @props.courseId})
    className = 'active' if isActive
    <BS.MenuItem
      key="dropdown-item-#{index}"
      onSelect={_.partial(@transitionToMenuItem, route.name, route.params)}
      className={className}
      eventKey={index + 2}>{route.label}</BS.MenuItem>

  renderMenuItems: ->
    {courseId} = @props

    menuItems = _.map CurrentUserStore.getCourseMenuRoutes(courseId), @renderCourseMenuItem

    menuItems.push <li key='nav-browse-the-book'>
      <BrowseTheBook unstyled={true} courseId={courseId} />
    </li>

    if CurrentUserStore.isAdmin()
      menuItems.push <li key='admin'><a key='admin' href='/admin'>Admin</a></li>

    if CurrentUserStore.isContentAnalyst()
      menuItems.push <li key='qa'><Router.Link to='QADashboard'>QA Content</Router.Link></li>

    menuItems.push <BS.MenuItem divider key='dropdown-item-divider'/>
    menuItems


  render: ->
    <BS.DropdownButton navItem
      eventKey={1}
      className='-hamburger-menu'
      title={<UserName/>}
      ref='navDropDown'>
      {@renderMenuItems()}
      <AccountLink key='accounts-link' />
      <BS.MenuItem
        key='nav-help-link'
        target='_blank'
        href={CurrentUserStore.getHelpLink()}>
          Get Help
      </BS.MenuItem>
      <BS.MenuItem
        className="logout"
        eventKey={4}
        key='dropdown-item-logout'>
          <LogOut className='btn btn-link btn-xs'>Log Out</LogOut>
      </BS.MenuItem>
    </BS.DropdownButton>


module.exports = UserActionsMenu
