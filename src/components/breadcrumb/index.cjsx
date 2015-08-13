React = require 'react'
BreadcrumbMixin = require './breadcrumb-mixin'

{StepPanel} = require '../../helpers/policies'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

BreadcrumbStatic = React.createClass
  displayName: 'BreadcrumbStatic'
  mixins: [BreadcrumbMixin]
  componentWillMount: ->
    @setStep(@props)

  setStep: (props) ->
    {crumb} = props

    step = crumb.data
    if crumb.type is 'step'
      step = crumb.data

    @setState({step})

BreadcrumbTaskDynamic = React.createClass
  displayName: 'BreadcrumbTaskDynamic'
  mixins: [BreadcrumbMixin]
  componentWillMount: ->
    {crumb} = @props

    @setStep(@props)

    TaskStepStore.on('step.completed', @update)

    if crumb.type is 'step' and TaskStepStore.isPlaceholder(crumb.data.id)
      TaskStepStore.on('step.completed', @checkPlaceholder)
      TaskStepStore.on('step.loaded', @update)

  removeListeners: ->
    TaskStepStore.off('step.completed', @update)
    TaskStepStore.off('step.completed', @checkPlaceholder)
    TaskStepStore.off('step.loaded', @update)

  componentWillUnmount: ->
    @removeListeners()

  componentDidMount: ->
    @props.onMount?()

  setStep: (props) ->
    {crumb} = props

    step = crumb.data
    if crumb.type is 'step'
      # get the freshest version of the step
      step = TaskStepStore.get(crumb.data.id)

    canReview = StepPanel.canReview(step.id) if crumb.type is 'step' and step?

    @setState({step, canReview})

  checkPlaceholder: ->
    {task_id, id} = @props.crumb.data
    unless TaskStore.hasIncompleteCoreStepsIndexes(task_id)
      TaskStepActions.load(id)

  update: (id) ->
    {crumb} = @props

    if (crumb.data.id is id)
      @setStep(@props)

module.exports = {BreadcrumbTaskDynamic, BreadcrumbStatic}
