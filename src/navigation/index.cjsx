React = require 'react'
BS = require 'react-bootstrap'
{CloseButton} = require 'openstax-react-components'
{CourseNameBase} = require './course-name'

Course = require '../course/model'
user = require '../user/model'
{channel} = require './model'
api = require '../api'
UserMenu = require '../user/menu'

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
    user.channel.on('logout.received', @close)

  componentWillUnmount: ->
    user.channel.off('change', @update)

  update: ->
    @forceUpdate() if @isMounted()

  close: ->
    channel.emit('close.clicked')
    @context.close?()

  handleSelect: (selectedKey) ->
    channel.emit("show.#{selectedKey}", view: selectedKey) if selectedKey?

  render: ->
    {course} = @props
    {view} = @context

    brand = <span>
      <strong>Concept</strong> Coach
    </span>

    courseItems = [
      <BS.NavItem
        active={view is 'task'}
        eventKey='task'
        key='task'
        className='concept-coach-exercise-nav'>
        Exercise
      </BS.NavItem>
      <BS.NavItem
        active={view is 'progress'}
        eventKey='progress'
        key='progress'
        className='concept-coach-dashboard-nav'>
        My Progress
      </BS.NavItem>
    ] if course?.isRegistered()

    <BS.Navbar brand={brand} toggleNavKey={0} fixedTop fluid>
      <BS.CollapsibleNav eventKey={0} collapsible={true}>
        <BS.Nav navbar onSelect={@handleSelect}>
          <BS.NavItem disabled={true}>
            <CourseNameBase course={course}/>
          </BS.NavItem>
        </BS.Nav>
        <BS.Nav right navbar activeKey={view} onSelect={@handleSelect}>
          <UserMenu course={@props.course} />
          {courseItems}
          <BS.NavItem
            onClick={@close}
            className='concept-coach-dashboard-nav'>
            <BS.Button className='btn-plain'>Close</BS.Button>
          </BS.NavItem>
        </BS.Nav>
      </BS.CollapsibleNav>
    </BS.Navbar>

module.exports = {Navigation, channel}
