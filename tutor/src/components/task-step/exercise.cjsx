React = require 'react'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskProgressActions, TaskProgressStore} = require '../../flux/task-progress'
{TaskStore} = require '../../flux/task'
{TaskPanelStore} = require '../../flux/task-panel'
{StepPanel} = require '../../helpers/policies'

RelatedContentLink = require '../related-content-link'
{ChapterSectionMixin, CardBody, ExerciseWithScroll, ExControlButtons} = require 'shared'

StepFooter = require './step-footer'

canOnlyContinue = (id) ->
  _.chain(StepPanel.getRemainingActions(id))
    .difference(['clickContinue'])
    .isEmpty()
    .value()

getWaitingText = (id) ->
  switch
    when TaskStepStore.isSaving(id)  then 'Saving…'
    when TaskStepStore.isLoading(id) then 'Loading…'
    else null

getReadingForStep = (id, taskId) ->
  TaskStore.getReadingForTaskId(taskId, id)

getCurrentPanel = (id) ->
  StepPanel.getPanel(id)

module.exports = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  mixins: [ ChapterSectionMixin ]

  contextTypes:
    router: React.PropTypes.object

  getInitialState: ->
    partsInfo = @getPartsInfo()
    taskInfo = @getTaskInfo()

    _.extend({}, partsInfo, taskInfo)

  getPartsInfo: (props) ->
    props ?= @props

    {id, taskId, courseId, onNextStep} = props
    parts = TaskStore.getStepParts(taskId, id)

    parts = _.map(parts, (part) ->
      stepIndex = TaskPanelStore.getStepIndex(taskId, {id: part.id})
      questionNumber = TaskStore.getStepIndex(taskId, part.id) + 1

      _.extend({}, part, {stepIndex, questionNumber})
    )

    lastPartId = _.last(parts).id
    isSinglePartExercise = @isSinglePart(parts)

    {parts, lastPartId, isSinglePartExercise}

  getTaskInfo: (props) ->
    props ?= @props
    {taskId} = props

    task = TaskStore.get(taskId)
    currentStep = TaskProgressStore.get(taskId)

    {task, currentStep}

  isSinglePart: (parts) ->
    parts.length is 1

  componentWillMount: ->
    @startListeningForProgress()

  componentWillUnmount: ->
    @stopListeningForProgress()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.taskId isnt @props.taskId
      nextState = _.extend({}, @getTaskInfo(nextProps), @getPartsInfo(nextProps))
      @setState(nextState)
      @stopListeningForProgress()
      @startListeningForProgress(nextProps)
    else
      @setState(@getPartsInfo(nextProps))

  stopListeningForProgress: (props) ->
    props ?= @props
    {taskId} = props

    TaskProgressStore.off("update.#{taskId}", @setCurrentStepFromProgress)

  startListeningForProgress: (props) ->
    props ?= @props
    {taskId} = props

    TaskProgressStore.on("update.#{taskId}", @setCurrentStepFromProgress)

  canAllContinue: ->
    {parts} = @state

    _.every parts, (part) ->
      canOnlyContinue(part.id)

  allCorrect: ->
    {parts} = @state

    _.every parts, (part) ->
      (part.correct_answer_id is part.answer_id)

  getReviewProps: ->
    {recoverFor} = @props
    {task, lastPartId} = @state

    tryAnother: _.partial(recoverFor, lastPartId)
    canTryAnother: TaskStepStore.canTryAnother(lastPartId, task, not @allCorrect())
    isRecovering: TaskStepStore.isRecovering(lastPartId)

  setCurrentStepFromProgress: ({current}) ->
    @setCurrentStep(current)

  setCurrentStep: (currentStep) ->
    return unless currentStep isnt @state.currentStep

    @setState({currentStep})
    @props.goToStep(currentStep)

  setCurrentStepByStepId: (id) ->
    {taskId} = @props
    stepNavIndex = TaskPanelStore.getStepIndex(taskId, {id})
    @setCurrentStep(stepNavIndex)

  onFreeResponseChange: (id, tempFreeResponse) ->
    TaskStepActions.updateTempFreeResponse(id, tempFreeResponse)

    # set part to be active if part of multipart
    @setCurrentStepByStepId(id) unless @isSinglePart(@state.parts)

  onChoiceChange: (id, answerId) ->
    TaskStepActions.setAnswerId(id, answerId)

    # set part to be active if part of multipart
    @setCurrentStepByStepId(id) unless @isSinglePart(@state.parts)

  isAnyCompletedPartSaving: ->
    {parts} = @state

    _.some parts, (part) ->
      part.is_completed and TaskStepStore.isSaving(part.id)

  getFooterWaitingText: ->
    'Saving…' if @isAnyCompletedPartSaving()

  render: ->
    {id, taskId, courseId, onNextStep, onStepCompleted, goToStep, pinned} = @props
    {parts, lastPartId, isSinglePartExercise, task, currentStep} = @state
    part = _.last(parts)

    if TaskStore.isDeleted(taskId)
      setFreeResponse = _.noop
      setAnswerId = _.noop
    else
      setFreeResponse = TaskStepActions.setFreeResponseAnswer
      setAnswerId = @onChoiceChange

    if @canAllContinue() or not @isSinglePart(parts)
      reviewProps = @getReviewProps()

      canContinueControlProps =
        panel: 'review'
        isContinueEnabled: @canAllContinue()
        onContinue: _.partial onNextStep, currentStep: part.stepIndex

      canContinueControlProps = _.extend({}, canContinueControlProps, reviewProps)
      canContinueControlProps.controlText = 'Continue' if task.type is 'reading'

      controlButtons = <ExControlButtons
        {...canContinueControlProps}
        waitingText={@getFooterWaitingText()}
        key='step-control-buttons'/>

    unless TaskStore.hasProgress(taskId)
      footer = <StepFooter
        id={id}
        key='step-footer'
        taskId={taskId}
        courseId={courseId}
        controlButtons={controlButtons}/>

    <ExerciseWithScroll
      {...@props}

      footer={footer}

      project='tutor'
      goToStep={_.partial(goToStep, _, true)}
      currentStep={currentStep}

      task={task}
      parts={parts}
      helpLink={
        <RelatedContentLink courseId={courseId} content={part.related_content} />
      }
      onStepCompleted={onStepCompleted}
      controlButtons={controlButtons}

      canReview={StepPanel.canReview(part.id)}
      disabled={TaskStepStore.isSaving(part.id)}

      canOnlyContinue={canOnlyContinue}
      getWaitingText={getWaitingText}
      getCurrentPanel={getCurrentPanel}
      getReadingForStep={getReadingForStep}
      setFreeResponseAnswer={setFreeResponse}
      onFreeResponseChange={@onFreeResponseChange}
      setAnswerId={setAnswerId}/>
