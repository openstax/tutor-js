React = require 'react'
camelCase = require 'camelcase'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'

ExerciseStepCard = require './card'
StepFooter = require '../step-footer'

# TODO clean this up.
NOT_REVIEW_PROPS = ['onNextStep', 'canReview', 'disabled']
NOT_MULTIPLE_CHOICE_PROPS = ['goToStep', 'refreshStep', 'recoverFor', 'canTryAnother', 'disabled']
NOT_FREE_RESPONSE_PROPS = ['onStepCompleted', 'goToStep', 'onNextStep', 'refreshStep', 'recoverFor', 'canTryAnother', 'canReview']
NOT_TEACHER_READ_ONLY_PROPS = ['onStepCompleted', 'onNextStep', 'canTryAnother', 'canReview', 'disabled']

ExerciseShell = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func.isRequired

    setFreeResponseAnswer: React.PropTypes.func
    setAnswerId: React.PropTypes.func
    getReadingForStep: React.PropTypes.func
    refreshStep: React.PropTypes.func
    recoverFor: React.PropTypes.func
    getCurrentPanel: React.PropTypes.func

    review: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool
    courseId: React.PropTypes.string
    canTryAnother: React.PropTypes.bool
    canReview: React.PropTypes.bool
    disabled: React.PropTypes.bool

  getInitialState: ->
    {id} = @props

    currentPanel: @props.getCurrentPanel(id)

  componentWillMount: ->
    {id} = @props
    @updateCurrentPanel(@props) unless @state.currentPanel

  componentWillReceiveProps: (nextProps) ->
    @updateCurrentPanel(nextProps)

  updateCurrentPanel: (props) ->
    {id} = props or @props
    currentPanel = @props.getCurrentPanel(id)
    @setState({currentPanel}) if currentPanel? and @state.currentPanel isnt currentPanel

  getDefaultProps: ->
    focus: true
    review: ''
    pinned: true
    canTryAnother: false

  refreshMemory: ->
    {id, taskId} = @props

    {index} = @props.getReadingForStep(id, taskId)
    @props.refreshStep(index, id)

  tryAnother: ->
    {id} = @props
    @props.recoverFor(id)

  onFreeResponseContinue: (state) ->
    {id} = @props
    {freeResponse} = state
    @props.setFreeResponseAnswer(id, freeResponse)

  onMultipleChoiceAnswerChanged: (answer) ->
    {id} = @props
    @props.setAnswerId(id, answer.id)

  getReviewProps: (id) ->
    reviewProps = _.omit(@props, NOT_REVIEW_PROPS)
    reviewProps.onContinue = @props.onNextStep
    reviewProps.refreshMemory = @refreshMemory
    reviewProps.tryAnother = @tryAnother

    reviewProps

  getMultipleChoiceProps: (id) ->
    multipleChoiceProps = _.omit(@props, NOT_MULTIPLE_CHOICE_PROPS)
    multipleChoiceProps.onAnswerChanged = @onMultipleChoiceAnswerChanged

    multipleChoiceProps

  getFreeResponseProps: (id) ->
    freeResponseProps = _.omit(@props, NOT_FREE_RESPONSE_PROPS)
    freeResponseProps.onContinue = @onFreeResponseContinue

    freeResponseProps

  getTeacherReadOnlyProps: (id) ->
    teacherReadOnlyProps = _.omit(@props, NOT_TEACHER_READ_ONLY_PROPS)
    teacherReadOnlyProps.onContinue = @props.onNextStep
    teacherReadOnlyProps.isContinueEnabled = false
    teacherReadOnlyProps.controlButtons = false
    teacherReadOnlyProps.type = 'teacher-review'

    teacherReadOnlyProps

  # add get props methods for different panel types as needed here

  render: ->
    {id, step, waitingText} = @props
    {currentPanel} = @state

    # panel is one of ['review', 'multiple-choice', 'free-response', 'teacher-read-only']
    getPropsForPanel = camelCase "get-#{currentPanel}-props"
    cardProps = @[getPropsForPanel]?(id)

    <ExerciseStepCard
      {...cardProps}
      step={step}
      panel={currentPanel}
      waitingText={waitingText}
    />


module.exports = React.createClass
  displayName: 'Exercise'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  render: ->
    {id, taskId} = @props
    step = TaskStepStore.get(id)
    stepActionProps = {}

    task = TaskStore.get(taskId)
    stepActionProps.canTryAnother = TaskStepStore.canTryAnother(id, task)
    stepActionProps.disabled = TaskStepStore.isSaving(id)
    stepActionProps.canReview = StepPanel.canReview(id)

    stepActionProps.setFreeResponseAnswer = TaskStepActions.setFreeResponseAnswer
    stepActionProps.setAnswerId = TaskStepActions.setAnswerId
    stepActionProps.getReadingForStep = (id, taskId) ->
      TaskStore.getReadingForTaskId(taskId, id)
    stepActionProps.getCurrentPanel = (id) ->
      unless TaskStepStore.isSaving(id)
        currentPanel = StepPanel.getPanel(id)
    stepActionProps.waitingText = switch
      when TaskStepStore.isLoading(id) then "Loading…"
      when TaskStepStore.isSaving(id)  then "Saving…"
      else null

    <ExerciseShell
      {...@props}
      {...stepActionProps}
      step={step}
      footer={<StepFooter/>}
    />
