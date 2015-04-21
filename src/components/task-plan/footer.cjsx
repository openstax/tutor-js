
React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

PlanFooter = React.createClass
  displayName: 'PlanFooter'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    id: React.PropTypes.any.isRequired
    courseId: React.PropTypes.any.isRequired
    clickedSelectProblem: React.PropTypes.func

  onSave: ->
    {id} = @props
    TaskPlanActions.save(id)

  onPublish: ->
    {id} = @props
    TaskPlanActions.publish(id)

  onDelete: () ->
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

    valid = TaskPlanStore.isValid(id)
    publishable = valid and not TaskPlanStore.isChanged(id)
    saveable = valid and TaskPlanStore.isChanged(id)
    deleteable = not TaskPlanStore.isNew(id) and not TaskPlanStore.isPublished(id)

    classes = ['-publish']
    classes.push('disabled') unless publishable
    classes = classes.join(' ')

    publishButton = <BS.Button bsStyle="link" className={classes} onClick={@onPublish}>Publish</BS.Button>

    if deleteable
      deleteLink = <BS.Button bsStyle="link" className="-delete" onClick={@onDelete}>Delete</BS.Button>

    if TaskPlanStore.isHomework(id) and not TaskPlanStore.isPublished(id)
      selectProblems = <BS.Button bsStyle="primary" className="-select-problems" onClick={clickedSelectProblem}>Select Problems</BS.Button>

    classes = ['-save']
    classes.push('disabled') unless saveable
    classes = classes.join(' ')

    saveLink = <BS.Button bsStyle="primary" className={classes} onClick={@onSave}>Save as Draft</BS.Button>

    statsLink = <BS.Button bsStyle="link" className="-stats" onClick={@onViewStats}>Stats</BS.Button>

    <span className="-footer-buttons">
      {selectProblems}
      {saveLink}
      {publishButton}
      {deleteLink}
      {statsLink}
    </span>

module.exports = PlanFooter
