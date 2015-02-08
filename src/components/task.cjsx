$ = require 'jquery'
React = require 'react'

api = require '../api'
{AnswerStore} = require '../flux/answer'
{TaskStore, TaskActions} = require '../flux/task'
TaskStep = require './task-step'
Breadcrumbs = require './breadcrumbs'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


module.exports = React.createClass
  displayName: 'Task'
  getInitialState: ->
    # Grab the currentStep from the URL from SingleTask
    if @props.params.currentStep?
      try
        currentStep = parseInt(@props.params.currentStep) - 1
      catch e
        currentStep = 0
    else
      model = TaskStore.get(@props.id)
      # Determine the first uncompleted step
      for step, i in model.steps
        unless step.is_completed
          currentStep = i
          break

    {currentStep}

  componentWillMount:   -> AnswerStore.addChangeListener(@update)
  componentWillUnmount: -> AnswerStore.removeChangeListener(@update)

  getDefaultCurrentStep: ->
    model = TaskStore.get(@props.id)
    # Determine the first uncompleted step
    currentStep = 0
    for step, i in model.steps
      unless step.is_completed
        currentStep = i
        break
    currentStep

  goToStep: (num) -> () =>
    # Curried for React
    @setState({currentStep: num})

  update: ->
    @setState({})

  render: ->
    {id} = @props
    model = TaskStore.get(id)
    steps = model.steps
    stepConfig = steps[@state.currentStep]

    if steps.length > 1
      breadcrumbs =
        <div className="panel-header">
          <Breadcrumbs model={model} goToStep={@goToStep} currentStep={@state.currentStep} />
        </div>

    if TaskStore.isStepAnswered(id, @state.currentStep)
      isDisabledClass = ''
    else
      isDisabledClass = 'disabled'

    <div className="task">
      {breadcrumbs}
      <TaskStep taskId={id} id={@state.currentStep} model={stepConfig} onComplete={@onStepComplete} />
    </div>

  onStepComplete: ->
    {id} = @props
    stepId = @state.currentStep
    TaskActions.completeStep(id, stepId)
    @setState({currentStep: @getDefaultCurrentStep()})
