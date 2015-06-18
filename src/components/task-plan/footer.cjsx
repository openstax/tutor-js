
React = require 'react'
BS = require 'react-bootstrap'
camelCase = require 'camelcase'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

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
    plan = TaskPlanStore.get(id)

    # can either be viewReadingStats or viewHomeworkStats
    viewStatsPath = camelCase("view-#{plan.type}-stats")
    @context.router.transitionTo(viewStatsPath, {courseId, id})

  render: ->
    {id, courseId, clickedSelectProblem, onPublish, onSave} = @props

    plan = TaskPlanStore.get(id)

    saveable = not TaskPlanStore.isPublished(id)
    deleteable = not TaskPlanStore.isNew(id) and not TaskPlanStore.isOpened(id)

    publishButton =
      <BS.Col sm={6} md={2}>
        <BS.Button bsStyle='primary' className="-publish" onClick={onPublish}>Publish</BS.Button>
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
          <BS.Button className='-save' disabled onClick={onSave}>Save as Draft</BS.Button>
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
