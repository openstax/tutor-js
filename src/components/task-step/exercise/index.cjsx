React = require 'react'
camelCase = require 'camelcase'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'

ExerciseStepCard = require './card'

module.exports = React.createClass
  displayName: 'Exercise'
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func.isRequired
    focus: React.PropTypes.bool.isRequired
    review: React.PropTypes.string.isRequired
    panel: React.PropTypes.string

  getInitialState: ->
    currentPanel: @props.panel

  componentWillMount: ->
    {id} = @props
    @updateCurrentPanel(@props) unless @state.currentPanel

  componentWillReceiveProps: (nextProps) ->
    @updateCurrentPanel(nextProps)

  updateCurrentPanel: (props) ->
    {id} = props or @props

    unless TaskStepStore.isSaving(id)
      currentPanel = StepPanel.getPanel(id)
      @setState({currentPanel})

  getDefaultProps: ->
    focus: true
    review: ''
    pinned: true

  refreshMemory: ->
    {id} = @props
    task_id = TaskStepStore.getTaskId(id)
    {index} = TaskStore.getReadingForTaskId(task_id, id)
    throw new Error('BUG: No reading found for task') unless index

    # Track what step is refreshed so that it can be skipped after refreshing.
    @props.refreshStep(index, id)

  tryAnother: ->
    {id} = @props
    @props.recoverFor(id)

  onFreeResponseContinue: (state) ->
    {id} = @props
    {freeResponse} = state
    TaskStepActions.setFreeResponseAnswer(id, freeResponse)

  onMultipleChoiceAnswerChanged: (answer) ->
    {id} = @props
    TaskStepActions.setAnswerId(id, answer.id)

  getReviewProps: (id) ->
    reviewProps = _.omit(@props, 'onNextStep')
    reviewProps.onContinue = @props.onNextStep

    task = TaskStore.get(TaskStepStore.getTaskId(id))
    canTryAnother = TaskStepStore.canTryAnother(id, task)

    reviewProps.canTryAnother = canTryAnother
    reviewProps.refreshMemory = @refreshMemory
    reviewProps.tryAnother = @tryAnother

    reviewProps

  getMultipleChoiceProps: (id) ->
    multipleChoiceProps = _.omit(@props, 'goToStep', 'refreshStep', 'recoverFor')
    canReview = StepPanel.canReview id

    multipleChoiceProps.onAnswerChanged = @onMultipleChoiceAnswerChanged
    multipleChoiceProps.canReview = canReview

    multipleChoiceProps

  getFreeResponseProps: (id) ->
    freeResponseProps = _.omit(@props, 'onStepCompleted', 'goToStep', 'onNextStep', 'refreshStep', 'recoverFor')
    disabled = TaskStepStore.isSaving(id)

    freeResponseProps.disabled = disabled
    freeResponseProps.onContinue = @onFreeResponseContinue

    freeResponseProps

  getTeacherReadOnlyProps: (id) ->
    teacherReadOnlyProps = _.omit(@props, 'onStepCompleted', 'onNextStep')
    teacherReadOnlyProps.onContinue = @props.onNextStep
    teacherReadOnlyProps.isContinueEnabled = false
    teacherReadOnlyProps.controlButtons = false
    teacherReadOnlyProps.type = 'teacher-review'

    teacherReadOnlyProps

  # add get props methods for different panel types as needed here

  render: ->
    {pinned, courseId, id, taskId, review} = @props
    {currentPanel} = @state
    step = TaskStepStore.get(id)

    waitingText = switch
      when TaskStepStore.isLoading(id) then "Loading…"
      when TaskStepStore.isSaving(id)  then "Saving…"
      else null

    # panel is one of ['review', 'multiple-choice', 'free-response', 'teacher-read-only']
    getPropsForPanel = camelCase "get-#{currentPanel}-props"

    cardProps = @[getPropsForPanel]?(id)

    <ExerciseStepCard
      {...cardProps}
      step={step}
      pinned={pinned}
      review={review}
      panel={currentPanel}
      waitingText={waitingText}
    />
