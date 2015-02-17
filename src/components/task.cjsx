$ = require 'jquery'
React = require 'react'

api = require '../api'
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
    currentStep = 0
    model = TaskStore.get(@props.id)
    if model
      # Determine the first uncompleted step
      for step, i in model.steps
        unless step.is_completed
          currentStep = i
          break

    {currentStep}

  componentWillMount:   -> TaskStore.addChangeListener(@update)
  componentWillUnmount: -> TaskStore.removeChangeListener(@update)

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
    switch TaskStore.getAsyncStatus(id)
      when 'loaded'
        @renderBody()
      when 'failed'
        <div>Error. Please refresh</div>
      when 'loading'
        # If reloading then do not replace the entire DOM (and lose currentStep state)
        if TaskStore.get(id)
          @renderBody()
        else
          <div>Loading...</div>
      else
        <div>Starting loading</div>

  renderBody: ->
    {id} = @props
    model = TaskStore.get(id)
    steps = model.steps
    stepConfig = steps[@state.currentStep]

    if steps.length > 1
      breadcrumbs =
        <div className="panel-header">
          <Breadcrumbs model={model} goToStep={@goToStep} currentStep={@state.currentStep} />
        </div>

    <div className="task">
      {breadcrumbs}
      <TaskStep
        id={@state.currentStep}
        model={stepConfig}
        task={model}
        onStepCompleted={@onStepCompleted}
        onNextStep={@onNextStep}
      />
    </div>

  onStepCompleted: ->
    {id} = @props
    model = TaskStore.get(id)
    step = model.steps[@state.currentStep]
    TaskActions.completeStep(model, step)

  onNextStep: ->
    @setState({currentStep: @getDefaultCurrentStep()})
