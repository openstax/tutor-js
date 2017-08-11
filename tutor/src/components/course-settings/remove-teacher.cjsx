React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
BindStoreMixin = require '../bind-store-mixin'
{CourseStore, CourseActions} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
TutorRouter = require '../../helpers/router'

Icon = require '../icon'
Name = require '../name'
{AsyncButton} = require 'shared'

WARN_REMOVE_CURRENT = 'If you remove yourself from the course you will be redirected to the dashboard.'

module.exports = React.createClass
  displayName: 'RemoveTeacherLink'
  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    teacher: React.PropTypes.object.isRequired
    courseRoles: React.PropTypes.array.isRequired
    courseId: React.PropTypes.string.isRequired
  contextTypes:
    router: React.PropTypes.object

  isRemovalCurrentTeacher: ->
    role = _.chain(@props.courseRoles)
      .pluck('id')
      .contains(@props.teacher.role_id)
      .value()

  goToDashboard: ->
    @_removeListener()
    RosterStore.once('deleted', =>
      @context.router.history.push(TutorRouter.makePathname('myCourses'))
    )

  performDeletion: ->
    {courseId, teacher, courseRoles} = @props
    RosterActions.teacherDelete(teacher.id, courseId, @isRemovalCurrentTeacher())
    if @isRemovalCurrentTeacher() then @goToDashboard()

  confirmPopOver: ->
    removeButton =
      <AsyncButton
        bsStyle='danger'
        onClick={@performDeletion}
        isWaiting={RosterStore.isTeacherDeleting(@props.teacher.id)}
        waitingText='Removing...'>
        <Icon type='ban' /> Remove
      </AsyncButton>

    title = <span>Remove <Name {...@props.teacher} />?</span>
    <BS.Popover
      id="settings-remove-popover-#{@props.teacher.id}"
      className='settings-remove-teacher'
      title={title}
    >
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
