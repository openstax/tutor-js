React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{TeacherRosterStore, TeacherRosterActions} = require '../../flux/teacher-roster'
{CourseStore, CourseActions} = require '../../flux/course'
Icon = require '../icon'
Name = require '../name'
AsyncButton = require '../buttons/async-button'

WARN_REMOVE_CURRENT = 'If you remove yourself from the course you will be redirected to the dashboard.'

module.exports = React.createClass
  displayName: 'RemoveTeacherLink'
  propTypes:
    teacher: React.PropTypes.object.isRequired
    courseRoles: React.PropTypes.array.isRequired
    courseId: React.PropTypes.string.isRequired
  contextTypes:
    router: React.PropTypes.func

  isRemovalCurrentTeacher: ->
    role = _.chain(@props.courseRoles)
      .pluck('id')
      .contains(@props.teacher.role_id)
      .value()

  goToDashboard: ->
    TeacherRosterStore.once 'deleted', =>
      #window.location.href = '/dashboard/'
      @context.router.transitionTo('dashboard')

  performDeletion: ->
    {courseId} = @props
    TeacherRosterActions.delete(@props.teacher.id)
    if @isRemovalCurrentTeacher() then @goToDashboard() else CourseActions.load(courseId)

  confirmPopOver: ->
    removeButton =
      <AsyncButton
        bsStyle='danger'
        onClick={@performDeletion}
        isWaiting={TeacherRosterStore.isDeleting(@props.courseId)}
        waitingText='Removing Instructor…'>
        <Icon type='ban' /> Remove
      </AsyncButton>

    title = <span>Remove <Name {...@props.teacher} />?</span>
    <BS.Popover className='teacher-remove' title={title} {...@props}>
      {removeButton}
      <div className='warning'>
        {WARN_REMOVE_CURRENT if @isRemovalCurrentTeacher()}
      </div>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><Icon type='ban' /> Remove</a>
    </BS.OverlayTrigger>
