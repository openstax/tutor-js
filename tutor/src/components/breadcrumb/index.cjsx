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
    if TaskStepStore.isPlaceholder(crumb.id)
      TaskStepStore.on('step.loaded', @update)

  componentWillUnmount: ->
    TaskStore.off('step.completed', @update)
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

    unless TaskStore.hasIncompleteCoreStepsIndexes(taskId) or
      TaskStepStore.isLoadingPersonalized(stepId)
        TaskStepActions.loadPersonalized(stepId)

  update: (id) ->
    {crumb} = @props
    @checkPlaceholder() if TaskStepStore.isPlaceholder(crumb.id)

    if (crumb.id is id)
      @setStep(@props)

  render: ->
    {step} = @state
    crumbProps = _.omit(@props, 'step')

    <Breadcrumb
      {...crumbProps}
      step={step}/>

module.exports = {BreadcrumbTaskDynamic, BreadcrumbStatic}
