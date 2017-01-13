React = require 'react'
BS = require 'react-bootstrap'
{CloseButton} = require 'shared'
{CourseNameBase} = require './course-name'

Course = require '../course/model'
user = require '../user/model'
{channel} = require './model'
UserMenu = require '../user/menu'
{NotificationsBar, NotificationActions} = require 'shared'

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
    @forceUpdate()

  close: ->
    @context.close?()

  handleSelect: (selectedKey) ->
    channel.emit("show.#{selectedKey}", view: selectedKey) if selectedKey?

  onAddStudentId: ->
    channel.emit('show.student_id', view: 'student_id')

  onCourseEnded: ->
    channel.emit('show.second-semester-registration', view: 'second-semester-registration')

  render: ->
    {course} = @props
    {view} = @context

    courseItems = [
      <BS.NavItem
        active={view is 'progress'}
        eventKey='progress'
        key='progress'
        className='concept-coach-dashboard-nav -progress'>
        My Progress
      </BS.NavItem>
    ] if course?.isRegistered()

    <BS.Navbar fixedTop fluid>
      <BS.Navbar.Header>
        <BS.Navbar.Brand>
          <span key='app' className='navbar-logo'>
            <strong>Concept</strong> Coach
          </span>
          <CourseNameBase key = 'course-name' className='hidden-sm hidden-xs' course={course}/>
        </BS.Navbar.Brand>
        <BS.Button className='btn-plain coach-close visible-xs' onClick={@close}>Close</BS.Button>
        {<BS.Navbar.Toggle /> if user.isLoggedIn()}
      </BS.Navbar.Header>
      <BS.Button
        className='btn-plain coach-close hidden-xs'
        onClick={@close}>
          Close
      </BS.Button>
      <BS.Navbar.Collapse>
        <BS.Nav pullRight navbar activeKey={view} onSelect={@handleSelect}>
          {courseItems}
          <UserMenu course={@props.course} />
        </BS.Nav>
      </BS.Navbar.Collapse>
      <NotificationsBar
        className="row"
        role={course?.getRole()}
        course={course}
        callbacks={
          missing_student_id: {onAdd: @onAddStudentId}
          course_has_ended:   {onCCSecondSemester: @onCourseEnded}
        }
      />
    </BS.Navbar>

module.exports = {Navigation, channel}
