React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
{SpyMode} = require 'openstax-react-components'

{channel} = tasks = require './collection'
api = require '../api'
{Reactive} = require '../reactive'
apiChannelName = 'task'

exercises = {ExerciseStep} = require '../exercise'
breadcrumbs = {Breadcrumbs} = require '../breadcrumbs'

{TaskReview} = require './review'
{TaskTitle} = require './title'
{NoExercises} = require './no-exercises'

TaskBase = React.createClass
  displayName: 'TaskBase'
  getInitialState: ->
    {item} = @props

    task: item
    currentStep: 0

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
    {task} = @state
    {taskId} = @props
    (stepIndex <= task.steps.length) and ((not @isReviewStep(stepIndex)) or @canReview())

  canReview: ->
    {taskId} = @props
    not _.isEmpty tasks.getCompleteSteps(taskId)

  isReviewStep: (stepIndex) ->
    {task} = @state
    stepIndex is task.steps.length

  fetchTask: ->
    tasks.fetchByModule(@props)

  componentWillMount: ->
    api.channel.on('exercise.*.receive.complete', @fetchTask)
    exercises.channel.on('leave.*', @nextStep)

  componentWillUnmount: ->
    api.channel.off('exercise.*.receive.complete', @fetchTask)
    exercises.channel.off('leave.*', @nextStep)

  componentWillReceiveProps: (nextProps) ->
    nextState =
      task: nextProps.item

    if (_.isEmpty(@props.item) and not _.isEmpty(nextProps.item)) or
      (@props.taskId isnt nextProps.taskId)
        stepIndex = tasks.getFirstIncompleteIndex(nextProps.taskId)
        nextState.currentStep = stepIndex

    @setState(nextState)

  render: ->
    {task, currentStep} = @state
    {taskId} = @props
    return null unless task?

    breadcrumbs = <Breadcrumbs
      {...@props}
      canReview={@canReview()}
      goToStep={@goToStep}
      currentStep={currentStep}/>

    noExercises = not task.steps? or _.isEmpty(task.steps)

    if noExercises
      panel = <NoExercises/>
    else if task.steps[currentStep]?
      panel = <ExerciseStep
        className='concept-coach-task-body'
        id={task.steps[currentStep].id}
        pinned={false}/>
    else if @isReviewStep(currentStep)
      panel = <TaskReview {...@props} goToStep={@goToFirstIncomplete}/>

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
