React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

api = require '../../api'
{TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{CourseActions, CourseStore} = require '../../flux/course'

TaskStep = require '../task-step'
Ends = require '../task-step/ends'

Breadcrumbs = require './breadcrumbs'
Time = require '../time'


module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'ReadingTask'

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    {id} = @props
    currentStep = TaskStore.getDefaultStepIndex(id)
    {currentStep}

  getDefaultCurrentStep: ->
    {id} = @props
    TaskStore.getCurrentStepIndex(id)

  goToStep: (num) -> () =>
    # Curried for React
    @setState({currentStep: num})

  render: ->
    {id} = @props
    model = TaskStore.get(id)
    steps = TaskStore.getStepsIds(id)
    stepConfig = steps[@state.currentStep]

    # Since backend does not give us all the steps/steps content until we do the reading or work on certain steps,
    # we need to reload the step straight from the API
    TaskStepActions.forceReload(stepConfig.id) if stepConfig and not TaskStepStore.hasContent(stepConfig.id)

    {courseId} = @context.router.getCurrentParams()

    allStepsCompleted = TaskStore.isTaskCompleted(id)

    taskClasses = 'task'
    taskClasses += ' task-completed' if allStepsCompleted

    unless TaskStore.isSingleStepped(id)
      breadcrumbs =
        <div className="panel-header">
          <Breadcrumbs id={id} goToStep={@goToStep} currentStep={@state.currentStep} />
        </div>

    if @state.currentStep < -1
      throw new Error('BUG! currentStep is too small')

    else if @state.currentStep is -1
      if allStepsCompleted
        type = if model.type then model.type else 'task'
        End = Ends.get(type)

        panel = <End courseId={courseId} taskId={id} reloadPractice={@reloadTask}/>

      else
        footer = <BS.Button bsStyle="primary" className='-continue' onClick={@goToStep(0)}>Continue</BS.Button>
        
        panel = <BS.Panel bsStyle="default" footer={footer} className='-task-intro'>
                  <h1>{model.title}</h1>
                  <p>Due At: <Time date={model.due_at}></Time></p>
                </BS.Panel>

    else
      throw new Error('BUG: no valid step config') unless stepConfig

      panel = <TaskStep
                id={stepConfig.id}
                onNextStep={@onNextStep}
              />

    <div className={taskClasses}>
      {breadcrumbs}
      {panel}
    </div>

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: ->
    {id} = @props
    @setState({currentStep: @getDefaultCurrentStep()})
