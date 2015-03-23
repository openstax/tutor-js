React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

api = require '../../api'
{TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

TaskStep = require '../task-step'
Breadcrumbs = require './breadcrumbs'
Time = require '../time'

module.exports = React.createClass
  displayName: 'ReadingTask'

  getInitialState: ->
    {id} = @props
    steps = TaskStore.getSteps(id)
    if steps.length is 1
      # For non-reading tasks that are simple (1 step) just skip the overview page
      currentStep = 0
    else
      # Otherwise, start at the Overview page
      currentStep = -1

    {currentStep}

  getDefaultCurrentStep: ->
    {id} = @props
    steps = TaskStore.getSteps(id)
    # Determine the first uncompleted step
    currentStep = -1
    for step, i in steps
      unless step.is_completed
        currentStep = i
        break

    currentStep

  goToStep: (num) -> () =>
    # Curried for React
    @setState({currentStep: num})

  render: ->
    {id} = @props
    model = TaskStore.get(id)
    steps = TaskStore.getSteps(id)
    stepConfig = steps[@state.currentStep]

    allStepsCompleted = true
    for step in steps
      unless step.is_completed
        allStepsCompleted = false

    if steps.length > 1
      breadcrumbs =
        <div className="panel-header">
          <Breadcrumbs id={id} goToStep={@goToStep} currentStep={@state.currentStep} />
        </div>

    if @state.currentStep > steps.length
      throw new Error('BUG! currentStep is too large')
    else if @state.currentStep < -1
      throw new Error('BUG! currentStep is too small')

    else if @state.currentStep is -1
      if allStepsCompleted
        footer = <Router.Link to="dashboard" className="btn btn-primary">Back to Dashboard</Router.Link>

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
          id={stepConfig.id}
          onStepCompleted={@onStepCompleted}
          onNextStep={@onNextStep}
        />
      </div>


  onStepCompleted: ->
    {id} = @props
    # TODO: Operate on just the corrent step
    steps = TaskStore.getSteps(id)
    step = steps[@state.currentStep]
    TaskStepActions.complete(step.id)

  onNextStep: ->
    @setState({currentStep: @getDefaultCurrentStep()})
