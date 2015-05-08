
React = require 'react'
BS = require 'react-bootstrap'
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

  onPublish: ->
    {id} = @props
    TaskPlanStore.addChangeListener(@saved)
    TaskPlanActions.save(id)

  onDelete: ->
    {id} = @props
    if confirm('Are you sure you want to delete this?')
      TaskPlanActions.delete(id)
      @context.router.transitionTo('dashboard')

  onViewStats: ->
    {id, courseId} = @props
    @context.router.transitionTo('viewStats', {courseId, id, type: 'homework'})

  render: ->
    {id, courseId, clickedSelectProblem} = @props

    plan = TaskPlanStore.get(id)

    publishable = TaskPlanStore.isValid(id)
    deleteable = not TaskPlanStore.isNew(id) and not TaskPlanStore.isPublished(id)

    classes = ['-publish']
    classes.push('disabled') unless publishable
    classes = classes.join(' ')

    publishButton = <BS.Button bsStyle='link' className={classes} onClick={@onPublish}>Publish</BS.Button>

    if deleteable
      deleteLink = <BS.Button bsStyle='link' className='-delete' onClick={@onDelete}>Delete</BS.Button>

    if TaskPlanStore.isHomework(id) and not TaskPlanStore.isPublished(id)
      selectProblems = <BS.Button 
        bsStyle='primary' 
        className='-select-problems'
        onClick={clickedSelectProblem}>Select Problems
      </BS.Button>

    <span className='-footer-buttons'>
      {selectProblems}
      {publishButton}
      {deleteLink}
    </span>

module.exports = PlanFooter
