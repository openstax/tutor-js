React = require 'react'
camelCase = require 'camelcase'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'

{ExerciseFreeResponse, ExerciseMultiChoice, ExerciseReview} = require './modes'
ExerciseGroup = require './group'
StepFooter = require '../step-footer'
{CardBody} = require '../../pinned-header-footer-card/sections'

MODES =
  'review'            : ExerciseReview
  'multiple-choice'   : ExerciseMultiChoice
  'free-response'     : ExerciseFreeResponse
  'teacher-read-only' : ExerciseReview

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

  renderReview: (id, step, waitingText) ->
    reviewProps = _.omit(@props, 'onNextStep')
    reviewProps.onContinue = @props.onNextStep

    task = TaskStore.get(TaskStepStore.getTaskId(id))
    canTryAnother = TaskStepStore.canTryAnother(id, task)

    <ExerciseReview
      {...reviewProps}
      step={step}
      waitingText={waitingText}
      canTryAnother={canTryAnother}
      refreshMemory={@refreshMemory}
      tryAnother={@tryAnother}
    />

  renderMultipleChoice: (id, step, waitingText) ->
    multipleChoiceProps = _.omit(@props, 'goToStep', 'refreshStep', 'recoverFor')
    canReview = StepPanel.canReview id

    <ExerciseMultiChoice
      {...multipleChoiceProps}
      step={step}
      canReview={canReview}
      waitingText={waitingText}
      onAnswerChanged={@onMultipleChoiceAnswerChanged}
    />

  renderFreeResponse: (id, step, waitingText) ->
    freeResponseProps = _.omit(@props, 'onStepCompleted', 'goToStep', 'onNextStep', 'refreshStep', 'recoverFor')
    disabled = TaskStepStore.isSaving(id)

    <ExerciseFreeResponse
      {...freeResponseProps}
      step={step}
      waitingText={waitingText}
      disabled={disabled}
      onContinue={@onFreeResponseContinue}
    />

  renderTeacherReadOnly: (id, step, waitingText) ->
    teacherReadOnlyProps = _.omit(@props, 'onStepCompleted', 'onNextStep')
    teacherReadOnlyProps.onContinue = @props.onNextStep

    <ExerciseReview
      {...teacherReadOnlyProps}
      step={step}
      waitingText={waitingText}
    />

  # add render methods for different panel types as needed here

  render: ->
    {pinned, courseId, id, taskId, review} = @props
    {currentPanel} = @state
    step = {group, related_content} = TaskStepStore.get(id)

    waitingText = switch
      when TaskStepStore.isLoading(@props.id) then "Loading…"
      when TaskStepStore.isSaving(@props.id)  then "Saving…"
      else null

    # panel is one of ['review', 'multiple-choice', 'free-response', 'teacher-read-only']
    renderPanelMethod = camelCase "render-#{currentPanel}"

    throw new Error("BUG: panel #{currentPanel} for an exercise does not have a render method") unless @[renderPanelMethod]?

    footer = <StepFooter
      {...@props}
    />
    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {@[renderPanelMethod]?(id, step, waitingText)}
      <ExerciseGroup
        key='step-exercise-group'
        group={group}
        related_content={related_content}/>
    </CardBody>
