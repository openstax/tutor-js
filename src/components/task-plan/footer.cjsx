
React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
AsyncButton = require '../buttons/async-button'

PlanFooter = React.createClass
  displayName: 'PlanFooter'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    clickedSelectProblem: React.PropTypes.func

  saved: ->
    courseId = @props.courseId
    TaskPlanStore.removeChangeListener(@saved)
    @context.router.transitionTo('taskplans', {courseId})

  onDelete: ->
    {id} = @props
    if confirm('Are you sure you want to delete this?')
      TaskPlanActions.delete(id)
      @context.router.transitionTo('dashboard')

  onCancel: ->
    {id} = @props
    if confirm('Are you sure you want to cancel?')
      TaskPlanActions.reset(id)
      @context.router.transitionTo('dashboard')

  onViewStats: ->
    {id, courseId} = @props
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {id, courseId, clickedSelectProblem, onPublish, onSave} = @props

    plan = TaskPlanStore.get(id)

    saveable = not TaskPlanStore.isPublished(id)
    deleteable = not TaskPlanStore.isNew(id) and not TaskPlanStore.isOpened(id)
    isWaiting = TaskPlanStore.isSaving(id)
    isFailed = TaskPlanStore.isFailed(id)

    publishButton =
      <BS.Col sm={6} md={2}>
        <AsyncButton
          bsStyle='primary'
          className='-publish'
          onClick={onPublish}
          isWaiting={isWaiting}
          isFailed={isFailed}
          waitingText='Publishing…'
          >
          {'Publish'}
        </AsyncButton>
        <p>
          Publish will make the assignment available to
          students on the open date.  If open date is today,
          it will be available immediately.
        </p>
      </BS.Col>

    if deleteable
      deleteLink = <a className='delete-link' onClick={@onDelete}>
        <i className="fa fa-trash"></i> Delete Assignment</a>

    if saveable
      saveLink =
        <BS.Col sm={6} md={2}>
          <AsyncButton
            className='-save'
            onClick={onSave}
            isWaiting={isWaiting}
            isFailed={isFailed}
            waitingText='Saving…'
            >
            {'Save as Draft'}
          </AsyncButton>
          <p>
            An assignment in draft will not be available to students, even if the open date has passed.
          </p>
        </BS.Col>

    hasExercises = TaskPlanStore.getExercises(id)?.length
    if TaskPlanStore.isHomework(id) and not TaskPlanStore.isVisibleToStudents(id) and not hasExercises
      publishButton = null
      saveLink = null
      selectProblems = <BS.Col sm={6} md={2}><BS.Button
        bsStyle='primary'
        className='-select-problems'
        onClick={clickedSelectProblem}>Select Problems
      </BS.Button></BS.Col>

    <BS.Row className='footer-buttons'>
      {selectProblems}
      {publishButton}
      <BS.Col sm={6} md={2}>
        <BS.Button aria-role='close' onClick={@onCancel}>Cancel</BS.Button>
        <p>Discard all changes and return to the calendar.</p>
      </BS.Col>
      {saveLink}
      <BS.Col sm={6} md={2}>
        {deleteLink}
      </BS.Col>
    </BS.Row>

module.exports = PlanFooter
