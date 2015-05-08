React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
camelCase = require 'camelcase'

{TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

CrumbMixin = require './crumb-mixin'

TaskStep = require '../task-step'
Ends = require '../task-step/ends'
Breadcrumbs = require './breadcrumbs'

Time = require '../time'
Details = require './details'


module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'ReadingTask'

  mixins: [CrumbMixin]

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    {stepIndex} = @context.router.getCurrentParams()
    # url is 1 based so it matches the breadcrumb button numbers
    crumbKey = if stepIndex then parseInt(stepIndex) - 1 else @getDefaultCurrentStep()
    {currentStep: crumbKey}


  goToStep: (stepKey) ->
# Curried for React
    =>
      params = @context.router.getCurrentParams()
      # url is 1 based so it matches the breadcrumb button numbers
      params.stepIndex = stepKey + 1
      params.id = @props.id # if we were rendered directly, the router might not have the id
      @context.router.replaceWith('viewTask', params)
      @setState({currentStep: stepKey})

  goToCrumb: ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: @state.currentStep}

  renderIntro: (data) ->
    footer = <BS.Button bsStyle='primary' className='-continue' onClick={@goToStep(0)}>Continue</BS.Button>
    if data.due_at
      dueDate =
        <div className='-due-at'>Due At: <Time
          date={data.due_at}
          format='LLL'/></div>

    panel = <BS.Panel bsStyle='default' footer={footer} className='-task-intro'>
              <h1>{data.title}</h1>
              {dueDate}
            </BS.Panel>

  renderStep: (data) ->
    # Since backend does not give us all the steps/steps content until we do the reading or work on certain steps,
    # we need to reload the step straight from the API
    TaskStepActions.forceReload(data.id) if data and not TaskStepStore.hasContent(data.id)

    <TaskStep
      id={data.id}
      goToStep={@goToStep}
      onNextStep={@onNextStep}
    />

  renderEnd: (data) ->
    {courseId} = @context.router.getCurrentParams()
    type = if data.type then data.type else 'task'
    End = Ends.get(type)

    panel = <End courseId={courseId} taskId={data.id} reloadPractice={@reloadTask}/>

  # add render methods for different panel types as needed here

  render: ->
    {id} = @props
    task = TaskStore.get(id)
    # get the crumb that matches the current state
    crumb = @goToCrumb()

    # crumb.type is one of ['intro', 'step', 'end']
    renderPanelMethod = camelCase "render-#{crumb.type}"

    throw new Error("BUG: panel #{crumb.type} for #{task.type} does not have a render method") unless @[renderPanelMethod]?
    panel = @[renderPanelMethod]?(crumb.data)

    taskClasses = "task task-#{task.type}"
    taskClasses += ' task-completed' if TaskStore.isTaskCompleted(id)

    unless TaskStore.isSingleStepped(id)
      breadcrumbs =
        <div className='panel-header'>
          <Details task={task} />
          <Breadcrumbs id={id} goToStep={@goToStep} currentStep={@state.currentStep}/>
        </div>

    <div className={taskClasses}>
      {breadcrumbs}
      {panel}
    </div>

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: ->
    {id} = @props
    @setState({currentStep: @state.currentStep + 1})
