_ = require 'underscore'
React = require 'react'
{Breadcrumb} = require 'shared'

{StepPanel} = require '../../helpers/policies'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

BreadcrumbStatic = React.createClass
  displayName: 'BreadcrumbStatic'
  propTypes:
    crumb: React.PropTypes.shape(
      type: React.PropTypes.string.isRequired
      # data: React.PropTypes.shape(
      #   id: React.PropTypes.string.isRequired
      #   task_id: React.PropTypes.string.isRequired
      # ).isRequired
    ).isRequired

  componentWillMount: ->
    @setStep(@props)

  setStep: (props) ->
    {crumb} = props
    @setState({step: crumb})

  render: ->
    {step} = @state
    crumbProps = _.omit(@props, 'step')
    step = _.first(step) if _.isArray(step)

    <Breadcrumb
      {...crumbProps}
      step={step}/>

BreadcrumbTaskDynamic = React.createClass
  propTypes:
    crumb: React.PropTypes.shape(
      type: React.PropTypes.string.isRequired
      # data: React.PropTypes.shape(
      #   id: React.PropTypes.number.isRequired
      #   task_id: React.PropTypes.number.isRequired
      # ).isRequired
    ).isRequired
    onMount: React.PropTypes.func

  displayName: 'BreadcrumbTaskDynamic'
  componentWillMount: ->
    {crumb} = @props
    @setStep(@props)
    TaskStore.on('step.completed', @update)
    TaskStore.on('step.completing', @update)
    if TaskStepStore.isPlaceholder(crumb.id)
      TaskStepStore.on('step.loaded', @update)

  componentWillUnmount: ->
    TaskStore.off('step.completed', @update)
    TaskStore.off('step.completing', @update)
    TaskStepStore.off('step.loaded', @update)


  componentDidMount: ->
    @props.onMount?()

  setStep: (props) ->
    {crumb} = props

    step = crumb
    if crumb.id?
      # get the freshest version of the step
      step = TaskStepStore.get(crumb.id)

    canReview = StepPanel.canReview(step.id) if crumb.id? and step?

    @setState({step, canReview})

  checkPlaceholder: ->
    {crumb} = @props
    stepId = crumb.id
    taskId = crumb.task.id

    console.info(TaskStore.hasIncompleteCoreStepsIndexes(taskId), TaskStepStore.isLoadingPersonalized(stepId))
    unless TaskStore.hasIncompleteCoreStepsIndexes(taskId) or
      TaskStepStore.isLoadingPersonalized(stepId)
        console.log('calling loadPersonalized')
        TaskStepActions.loadPersonalized(stepId)

  update: (id) ->
    {crumb} = @props
    @checkPlaceholder() if TaskStepStore.isPlaceholder(crumb.id)

    if (crumb.id is id)
      @setStep(@props)

  render: ->
    {step} = @state
    crumbProps = _.omit(@props, 'step', 'onMount')

    <Breadcrumb
      {...crumbProps}
      step={step}/>

module.exports = {BreadcrumbTaskDynamic, BreadcrumbStatic}
