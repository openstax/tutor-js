React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

UserName = require './username'
CourseName = require './coursename'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'Navigation'

  contextTypes:
    router: React.PropTypes.func

  logout: -> CurrentUserActions.logout()

  renderMenuItems: (courseId) ->
    {courseId} = @context.router.getCurrentParams()

    [
      <BS.MenuItem
        href={@context.router.makeHref('viewStudentDashboard', {courseId})}
        eventKey={2}>Dashboard</BS.MenuItem>
      <BS.MenuItem
        href={@context.router.makeHref('viewGuide', {courseId})}
        eventKey={3}>Learning Guide</BS.MenuItem>
      <BS.MenuItem divider />
    ]

  render: ->

    brand = <Router.Link to='dashboard' className='navbar-brand'>
              <i className='ui-brand-logo'></i>
            </Router.Link>

    {courseId} = @context.router.getCurrentParams()
    menuItems = @renderMenuItems(courseId) if courseId

    <BS.Navbar brand={brand} fixedTop fluid>
      <CourseName courseId={courseId}/>
      <BS.Nav right>
        <BS.DropdownButton eventKey={1} title={<UserName/>}>
          {menuItems}
          <BS.MenuItem eventKey={4} onClick={@logout}>Sign Out!</BS.MenuItem>
        </BS.DropdownButton>
      </BS.Nav>
    </BS.Navbar>
