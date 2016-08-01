React = require 'react'
BS = require 'react-bootstrap'
{CloseButton} = require 'openstax-react-components'
{CourseNameBase} = require './course-name'

Course = require '../course/model'
user = require '../user/model'
{channel} = require './model'
api = require '../api'
UserMenu = require '../user/menu'
{NotificationsBar} = require 'openstax-react-components'

Navigation = React.createClass
  displayName: 'Navigation'

  contextTypes:
    close: React.PropTypes.func
    view: React.PropTypes.string

  propTypes:
    course: React.PropTypes.instanceOf(Course)

  componentWillMount: ->
    user.ensureStatusLoaded()
    user.channel.on('change', @update)

  componentWillUnmount: ->
    user.channel.off('change', @update)

  update: ->
    @forceUpdate() if @isMounted()

  close: ->
    @context.close?()

  handleSelect: (selectedKey) ->
    channel.emit("show.#{selectedKey}", view: selectedKey) if selectedKey?

  render: ->
    {course} = @props
    {view} = @context

    brand = [
      <span key='app' className='navbar-logo'><strong>Concept</strong> Coach</span>
      <CourseNameBase key = 'course-name' className='hidden-sm hidden-xs' course={course}/>
    ]

    courseItems = [
      <BS.NavItem
        active={view is 'progress'}
        eventKey='progress'
        key='progress'
        className='concept-coach-dashboard-nav -progress'>
        My Progress
      </BS.NavItem>
    ] if course?.isRegistered()

    <BS.Navbar brand={brand} toggleNavKey={0} fixedTop fluid>
      <BS.CollapsibleNav eventKey={0} collapsible={true}>
        <BS.Nav right navbar activeKey={view} onSelect={@handleSelect}>
          <UserMenu course={@props.course} />
          {courseItems}
          <BS.NavItem
            onClick={@close}
            className='concept-coach-dashboard-nav'>
            <BS.Button className='btn-plain -coach-close'>Close</BS.Button>
          </BS.NavItem>
        </BS.Nav>
      </BS.CollapsibleNav>
      <NotificationsBar />
    </BS.Navbar>

module.exports = {Navigation, channel}
