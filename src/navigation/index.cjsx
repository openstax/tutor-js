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

  propTypes:
    close: React.PropTypes.func
    course: React.PropTypes.instanceOf(Course)

  componentWillMount: ->
    user.ensureStatusLoaded()
    user.channel.on("change", @update)

  componentWillUnmount: ->
    user.channel.off("change", @update)

  getInitialState: ->
    active: ''

  update: ->
    @forceUpdate() if @isMounted()

  showExercise: ->
    channel.emit('show.task', {view: 'task'})

  showProgress: ->
    channel.emit('show.progress', {view: 'progress'})

  showDashboard: ->
    channel.emit('show.dashboard', {view: 'dashboard'})

  close: ->
    channel.emit('close.clicked')
    @props.close?()

  handleSelect: (selectedKey) ->
    @setState(active: selectedKey)
    @[selectedKey]?()

  render: ->
    {active} = @state
    {course} = @props

    brand = <span>
      <strong>Concept</strong> Coach
    </span>

    courseItems = [
      <BS.NavItem
        eventKey='showExercise'
        className='concept-coach-exercise-nav'>
        Exercise
      </BS.NavItem>
      <BS.NavItem
        eventKey='showProgress'
        className='concept-coach-dashboard-nav'>
        My Progress
      </BS.NavItem>
    ] if course?.isRegistered()

    <BS.Navbar brand={brand} fixedTop fluid>
      <BS.CollapsibleNav eventKey={0}>
        <BS.Nav navbar onSelect={@handleSelect}>
          <BS.NavItem disabled={true} eventKey='showCourse'>
            <CourseNameBase course={course}/>
          </BS.NavItem>
        </BS.Nav>
        <BS.Nav right navbar activeKey={active} onSelect={@handleSelect}>
          <UserMenu course={@props.course} />
          {courseItems}
          <BS.NavItem
            eventKey='close'
            className='concept-coach-dashboard-nav'>
            <BS.Button>Back to Book</BS.Button>
          </BS.NavItem>
        </BS.Nav>
      </BS.CollapsibleNav>
    </BS.Navbar>

module.exports = {Navigation, channel}
