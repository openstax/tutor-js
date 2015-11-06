React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

{TeacherRosterStore, TeacherRosterActions} = require '../../flux/teacher-roster'
{CourseStore, CourseActions} = require '../../flux/course'
Icon = require '../icon'
Name = require '../name'

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
      window.location.href = '/dashboard/'

  performDeletion: ->
    TeacherRosterActions.delete(@props.teacher.id, @props.courseId)
    if @isRemovalCurrentTeacher() then @goToDashboard()

  confirmPopOver: ->
    title = <span>Remove <Name {...@props.teacher} />?</span>
    <BS.Popover className='teacher-remove' title={title} {...@props}>
      <BS.Button onClick={@performDeletion} bsStyle="danger">
        <Icon type='ban' /> Remove
      </BS.Button>
      <div className='warning'>
        {WARN_REMOVE_CURRENT if @isRemovalCurrentTeacher()}
      </div>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><Icon type='ban' /> Remove</a>
    </BS.OverlayTrigger>
