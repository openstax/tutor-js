$ = require 'jquery'
React = require 'react'
BS = require 'react-bootstrap'
{Link} = require 'react-router'

api = require '../../api'
{TaskStore, TaskActions} = require '../../flux/task'
TaskStep = require '../task-step'
Breadcrumbs = require './breadcrumbs'
Time = require '../time'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


module.exports = React.createClass
  displayName: 'ReadingTask'
  getInitialState: ->
    model = TaskStore.get(@props.id)
    if model? and model.steps.length is 1
      # For non-reading tasks that are simple (1 step) just skip the overview page
      currentStep = 0
    else
      # Otherwise, start at the Overview page
      currentStep = -1

    {currentStep}

  componentWillMount:   -> TaskStore.addChangeListener(@update)
  componentWillUnmount: -> TaskStore.removeChangeListener(@update)

  getDefaultCurrentStep: ->
    model = TaskStore.get(@props.id)
    # Determine the first uncompleted step
    currentStep = -1
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

    allStepsCompleted = true
    for step in model.steps
      unless step.is_completed
        allStepsCompleted = false

    if steps.length > 1
      breadcrumbs =
        <div className="panel-header">
          <Breadcrumbs model={model} goToStep={@goToStep} currentStep={@state.currentStep} />
        </div>

    if @state.currentStep > steps.length
      throw new Error('BUG! currentStep is too large')
    else if @state.currentStep < -1
      throw new Error('BUG! currentStep is too small')

    else if @state.currentStep is -1
      if allStepsCompleted
        footer = <Link to="dashboard" className="btn btn-primary">Back to Dashboard</Link>

        <div className="task task-completed">
          {breadcrumbs}
          <BS.Panel bsStyle="default" footer={footer}>
            <h1>You Are Done.</h1>
            <h3>Great Job!</h3>
          </BS.Panel>
        </div>
      else
        footer = <BS.Button bsStyle="primary" onClick={@goToStep(0)}>Continue</BS.Button>
        <div className="task">
          {breadcrumbs}
          <BS.Panel bsStyle="default" footer={footer}>
            <h1>{model.title}</h1>
            <p>Due At: <Time date={model.due_at}></Time></p>
          </BS.Panel>
        </div>
    else
      throw new Error('BUG: no valid step config') unless stepConfig

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
