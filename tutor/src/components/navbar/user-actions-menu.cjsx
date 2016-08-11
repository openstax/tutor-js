React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'
classnames = require 'classnames'

UserName = require './username'
AccountLink = require './account-link'
BrowseTheBook = require '../buttons/browse-the-book'
BindStoreMixin = require '../bind-store-mixin'
LogOut = require './logout'

{CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

UserActionsMenu = React.createClass

  mixins: [BindStoreMixin]
  bindStore: CurrentUserStore

  propTypes:
    courseId: React.PropTypes.string
    onItemClick: React.PropTypes.func.isRequired

  contextTypes:
    router: React.PropTypes.func

  transitionToMenuItem: (routeName, params, mouseEvent) ->
    mouseEvent.preventDefault()
    @context.router.transitionTo(routeName, params)

  componentWillMount: ->
    CurrentUserStore.ensureLoaded()

  externalLinkClicked: ->
    @props.onItemClick()

  renderMenuItem: (route, index) ->
    isActive = @context.router.isActive(route.name) if route.name?

    menuGoProps = if route.href
      href: route.href
      onSelect: @props.onItemClick
    else
      href: @context.router.makeHref(route.name, route.params)
      onSelect: (event) =>
        @transitionToMenuItem(route.name, route.params, event)
        @props.onItemClick()
        return null

    key = if route.key then "dropdown-item-#{route.key}" else "dropdown-item-#{index}"

    # MenuItem doesn't pass on props to the li currently, so using className instead for route.name visual control.
    <BS.MenuItem
      {...menuGoProps}
      className={classnames(route.name, 'active': isActive)}
      key={key}
      data-name={route.name}
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
      menu.push @renderMenuItem({name: 'QADashboard', label: 'QA Content', params: {}}, menu.length )
      menu.push @renderMenuItem({label: 'Content Analyst', href: '/content_analyst', key: 'ca'}, menu.length )

    menu.push <BS.MenuItem divider key='dropdown-item-divider'/>
    menu


  render: ->
    course = CourseStore.get(@props.courseId)

    <BS.NavDropdown
      eventKey={1}
      className={classnames('-hamburger-menu', 'is-concept-coach': course?.is_concept_coach)}
      id='navbar-dropdown'
      title={<UserName/>}
      ref='navDropDown'>
      {@renderMenuItems()}
      <AccountLink key='accounts-link' onClick={@externalLinkClicked} />
      <BS.MenuItem
        key='nav-help-link'
        className='-help-link'
        target='_blank'
        href={CurrentUserStore.getHelpLink(@props.courseId)}
        onSelect={@externalLinkClicked}>
          Get Help
      </BS.MenuItem>
      <LogOut isConceptCoach={@props.course?.is_concept_coach} />
    </BS.NavDropdown>


module.exports = UserActionsMenu
