React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

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

  transitionToMenuItem: (to, mouseEvent) ->
    mouseEvent.preventDefault()
    @context.router.push(to)

  componentWillMount: ->
    CurrentUserStore.ensureLoaded()

  renderMenuItem: (route, index) ->
    isActive = @context.router.isActive(route.to) if route.to?

    menuGoProps = if route.href
      href: route.href
    else
      onSelect: _.partial(@transitionToMenuItem, route.to)
      href: @context.router.createHref(route.to)

    key = if route.key then "dropdown-item-#{route.key}" else "dropdown-item-#{index}"

    # MenuItem doesn't pass on props to the li currently, so using className instead for route.to visual control.
    <BS.MenuItem
      {...menuGoProps}
      className={classnames(route.to, 'active': isActive)}
      key={key}
      data-name={route.to}
      eventKey={index + 2}>
        {route.label}
    </BS.MenuItem>

  renderMenuItems: ->
    {courseId} = @props

    menu = _.map CurrentUserStore.getCourseMenuRoutes(courseId), @renderMenuItem

    menu.push <li key='nav-browse-the-book'>
      <BrowseTheBook unstyled={true} courseId={courseId} />
    </li>

    if CurrentUserStore.isAdmin()
      menu.push @renderMenuItem({label: 'Admin', href: '/admin', key: 'admin'}, menu.length )

    if CurrentUserStore.isCustomerService()
      menu.push @renderMenuItem({label: 'Customer Service', href: '/customer_service', key: 'cs'}, menu.length )

    if CurrentUserStore.isContentAnalyst()
      menu.push @renderMenuItem({to: '/qa', label: 'QA Content'}, menu.length )
      menu.push @renderMenuItem({label: 'Customer Analyst', href: '/content_analyst', key: 'ca'}, menu.length )

    menu.push <BS.MenuItem divider key='dropdown-item-divider'/>
    menu


  render: ->
    <BS.NavDropdown
      eventKey={1}
      className='-hamburger-menu'
      id='navbar-dropdown'
      title={<UserName/>}
      ref='navDropDown'>
      {@renderMenuItems()}
      <AccountLink key='accounts-link' />
      <BS.MenuItem
        key='nav-help-link'
        className='-help-link'
        target='_blank'
        href={CurrentUserStore.getHelpLink(@props.courseId)}>
          Get Help
      </BS.MenuItem>
      <LogOut isConceptCoach={@props.course?.is_concept_coach} />
    </BS.NavDropdown>


module.exports = UserActionsMenu
