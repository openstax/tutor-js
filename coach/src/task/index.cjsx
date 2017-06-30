React = require 'react'
EventEmitter2 = require 'eventemitter2'
_ = require 'underscore'
classnames = require 'classnames'
{SpyMode, TaskHelper, ExerciseIntro} = require 'shared'

{channel,getLastError} = tasks = require './collection'
api = require '../api'
{Reactive} = require '../reactive'
apiChannelName = 'task'

exercises = {ExerciseStep} = require '../exercise'
breadcrumbs = {Breadcrumbs} = require '../breadcrumbs'

{TaskReview} = require './review'
{TaskTitle} = require './title'
ErrorHandlers = require './errors'

TaskBase = React.createClass
  displayName: 'TaskBase'

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    moduleUUID: React.PropTypes.string.isRequired

  # Book and Project context is used by the exercise identifier link which
  # deeply nested and impractical to pass through the tree.
  childContextTypes:
    bookUUID:  React.PropTypes.string
    oxProject: React.PropTypes.string

  getChildContext: ->
    bookUUID: @props.collectionUUID
    oxProject: 'cc'

  getInitialState: ->
    {item} = @props
    initialState = @getState()

    _.extend({currentStep: 0}, initialState)

  contextTypes:
    close: React.PropTypes.func
    navigator: React.PropTypes.instanceOf(EventEmitter2)

  getState: (props) ->
    props ?= @props
    {item} = props

    return {steps: [], task: item} unless item

    crumbs = TaskHelper.mapSteps(item)
    steps = @setupSteps({steps: crumbs})

    {crumbs, steps, task: item}

  setupSteps: (task) ->
    steps = _.keys(task?.steps)
    steps.push('continue') unless _.isEmpty(steps)

    steps

  goToStep: (stepIndex) ->
    @setState(currentStep: stepIndex) if @isStepAllowed(stepIndex)

  nextStep: ->
    {currentStep} = @state
    @goToStep(currentStep + 1)

  goToFirstIncomplete: ->
    {taskId} = @props
    stepIndex = tasks.getFirstIncompleteIndex(taskId)
    @goToStep(stepIndex)

  isStepAllowed: (stepIndex) ->
    @isExerciseStep(stepIndex) or
      @isStaticStep(stepIndex) or
      (@isReviewStep(stepIndex) and @canReview()) or
      (@isContinueStep(stepIndex) and @shouldContinue())

  isExerciseStep: (stepIndex) ->
    {crumbs} = @state
    crumbs[stepIndex]?.id?

  canReview: ->
    {taskId} = @props
    not _.isEmpty tasks.getCompleteSteps(taskId)

  shouldContinue: ->
    {taskId} = @props
    _.isEmpty tasks.getIncompleteSteps(taskId)

  isStaticStep: (stepIndex) ->
    {crumbs} = @state
    not crumbs[stepIndex].id?

  isReviewStep: (stepIndex) ->
    {crumbs} = @state
    crumbs[stepIndex].type is 'end'

  isContinueStep: (stepIndex) ->
    {steps} = @state
    steps[stepIndex] is 'continue'

  componentWillMount: ->
    exercises.channel.on('leave.*', @nextStep)

  componentWillUnmount: ->
    exercises.channel.off('leave.*', @nextStep)

  componentWillReceiveProps: (nextProps) ->
    nextState = @getState(nextProps)

    if (_.isEmpty(@props.item) and not _.isEmpty(nextProps.item)) or
      (@props.taskId isnt nextProps.taskId)
        stepIndex = tasks.getFirstIncompleteIndex(nextProps.taskId)
        nextState.currentStep = stepIndex

    @setState(nextState)

  componentDidUpdate: ->
    {currentStep, steps} = @state
    {close, navigator} = @context

    step = steps[currentStep]
    navigator.emit('show.task', {view: 'task', step: step})

    close() if @isContinueStep(currentStep)

  render: ->
    {task, currentStep, crumbs} = @state
    {taskId} = @props
    return null unless task?

    breadcrumbs = <Breadcrumbs
      {...@props}
      canReview={@canReview()}
      shouldContinue={@shouldContinue()}
      goToStep={@goToStep}
      currentStep={currentStep}/>

    noExercises = not task.steps? or _.isEmpty(task.steps)

    error = getLastError()
    if error?.code
      ErrorHandler = ErrorHandlers[error.code]
    if noExercises and not ErrorHandler
      ErrorHandler = ErrorHandlers.no_exercises

    panel = if ErrorHandler
      <ErrorHandler />
    else if @isExerciseStep(currentStep)
      <ExerciseStep
        className='concept-coach-task-body'
        currentStep={currentStep}
        id={crumbs[currentStep].id}
        pinned={false}
      />
    else if @isReviewStep(currentStep)
      <TaskReview {...@props} goToStep={@goToFirstIncomplete}/>
    else if @isContinueStep(currentStep)
      null
    else if @isStaticStep(currentStep)
      {type} = crumbs[currentStep]

      <ExerciseIntro
        stepIntroType={type}
        project='concept-coach'
        onContinue={@nextStep}
      />

    taskClasses = classnames 'concept-coach-task',
      'card-body': noExercises

    <div className={taskClasses}>
      <TaskTitle {...@props}/>
      {breadcrumbs}
      {panel}
      <SpyMode.Content>{JSON.stringify(task.spy)}</SpyMode.Content>
    </div>


Task = React.createClass
  displayName: 'Task'
  filter: (props, eventData) ->
    toCompare = ['collectionUUID', 'moduleUUID']

    setProps = _.pick(props, toCompare)
    receivedData = _.pick(eventData.data, toCompare)

    _.isEqual(setProps, receivedData)

  render: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    <Reactive
      topic={taskId}
      store={tasks}
      apiChannelName={apiChannelName}
      collectionUUID={collectionUUID}
      moduleUUID={moduleUUID}
      fetcher={tasks.fetchByModule}
      filter={@filter}>
      <TaskBase {...@props} taskId={taskId}/>
    </Reactive>



module.exports = {Task, channel}
