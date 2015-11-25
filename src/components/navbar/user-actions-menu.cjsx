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

  renderMenuItem: (route, index) ->
    isActive = @context.router.isActive(route.name)
    <BS.MenuItem
      key="dropdown-item-#{index}"
      onSelect={_.partial(@transitionToMenuItem, route.name, route.params)}
      className={'active' if isActive}
      eventKey={index + 2}>{route.label}</BS.MenuItem>

  renderMenuItems: ->
    {courseId} = @props

    menu = _.map CurrentUserStore.getCourseMenuRoutes(courseId), @renderMenuItem

    menu.push <li key='nav-browse-the-book'>
      <BrowseTheBook unstyled={true} courseId={courseId} />
    </li>

    if CurrentUserStore.isAdmin()
      menu.push <li key='admin'><a href='/admin'>Admin</a></li>

    if CurrentUserStore.isCustomerService()
      menu.push <li key='cs'><a href='/customer_service'>Customer Service</a></li>

    if CurrentUserStore.isContentAnalyst()
      menu.push @renderMenuItem({name: 'QADashboard', label: 'QA Content', params: {}}, menu.length )
      menu.push <li key='ca'><a href='/content_analyst'>Content Analyst</a></li>

    menu.push <BS.MenuItem divider key='dropdown-item-divider'/>
    menu


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
          <LogOut
          isConceptCoach={@props.course?.is_concept_coach}
          className='btn btn-link btn-xs'>Log Out</LogOut>
      </BS.MenuItem>
    </BS.DropdownButton>


module.exports = UserActionsMenu
