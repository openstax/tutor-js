React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

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
    currentStep = @getDefaultCurrentStep()
    {currentStep}

  goToStep: (stepKey) -> () =>
    # Curried for React
    @setState({currentStep: stepKey})

  goToCrumb: ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: @state.currentStep}

  renderPanel: (type, data) ->
    panels =
      intro: (data) =>
        footer = <BS.Button bsStyle="primary" className='-continue' onClick={@goToStep(0)}>Continue</BS.Button>
        if data.due_at
          dueDate = <div className="-due-at">Due At: <Time date={data.due_at}></Time></div>

        panel = <BS.Panel bsStyle="default" footer={footer} className='-task-intro'>
                  <h1>{data.title}</h1>
                  {dueDate}
                </BS.Panel>

      step: (data) =>
        # Since backend does not give us all the steps/steps content until we do the reading or work on certain steps,
        # we need to reload the step straight from the API
        TaskStepActions.forceReload(data.id) if data and not TaskStepStore.hasContent(data.id)

        <TaskStep
          id={data.id}
          goToStep={@goToStep}
          onNextStep={@onNextStep}
        />

      end: (data) =>
        {courseId} = @context.router.getCurrentParams()
        type = if data.type then data.type else 'task'
        End = Ends.get(type)

        panel = <End courseId={courseId} taskId={data.id} reloadPractice={@reloadTask}/>

    panels[type](data)

  render: ->
    {id} = @props
    task = TaskStore.get(id)
    crumb = @goToCrumb()
    panel = @renderPanel(crumb.type, crumb.data)

    taskClasses = "task task-#{task.type}"
    taskClasses += ' task-completed' if TaskStore.isTaskCompleted(id)

    unless TaskStore.isSingleStepped(id)
      breadcrumbs =
        <div className="panel-header">
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
    @setState({currentStep: @getDefaultCurrentStep()})
