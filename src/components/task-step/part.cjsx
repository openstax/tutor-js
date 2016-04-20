React = require 'react'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
{StepPanel} = require '../../helpers/policies'

{Exercise} = require 'openstax-react-components'
{ExContinueButton, ExReviewControls} = require 'openstax-react-components/src/components/exercise/controls'
{props} = require 'openstax-react-components/src/components/exercise/props'

CONTROLS =
  'free-response': ExContinueButton
  'multiple-choice': ExContinueButton
  'review': ExReviewControls
  'teacher-read-only': ExContinueButton

CONTROLS_TEXT =
  'free-response': 'Answer'
  'multiple-choice': 'Submit'
  'review': 'Next Question'
  'teacher-read-only': 'Next Question'

canOnlyContinue = (id) ->
  _.chain(StepPanel.getRemainingActions(id))
    .difference(['clickContinue'])
    .isEmpty()
    .value()

getWaitingText = (id) ->
  switch
    when TaskStepStore.isLoading(id) then "Loading…"
    when TaskStepStore.isSaving(id)  then "Saving…"
    else null

getReadingForStep = (id, taskId) ->
  TaskStore.getReadingForTaskId(taskId, id)

getCurrentPanel = (id) ->
  unless TaskStepStore.isSaving(id)
    currentPanel = StepPanel.getPanel(id)

ExerciseControlButtons = React.createClass
  displayName: 'ExerciseControlButtons'
  getDefaultProps: ->
    disabled: false
    isContinueEnabled: false
    allowKeyNext: false
  shouldComponentUpdate: (nextProps) ->
    nextProps.panel?
  render: ->
    {panel, controlButtons, controlText} = @props

    ControlButtons = CONTROLS[panel]
    controlText ?= CONTROLS_TEXT[panel]

    controlProps = _.pick(@props, props.ExReviewControls)
    controlProps.children = controlText

    <ControlButtons {...controlProps}/>


ExercisePart = React.createClass
  displayName: 'ExercisePart'

  isLastPart: (id) ->
    {lastPartId} = @props

    id is lastPartId

  shouldControl: (id) ->
    {isSinglePartExercise} = @props

    isSinglePartExercise or not (@isLastPart(id) and canOnlyContinue(id))

  render: ->
    {taskId, stepProps, onStepCompleted, part, index} = @props

    stepIndex = TaskStore.getStepIndex(taskId, part.id)
    step = TaskStepStore.get(part.id)
    waitingText = getWaitingText(part.id)
    partProps = _.pick(part, 'id', 'taskId')
    partProps.focus = index is 0
    controlButtons = [] unless @shouldControl(part.id)

    <div
      className='exercise-wrapper'
      data-step-number={stepIndex + 1}
      key="exercise-part-#{part.id}">
      <Exercise
        {...partProps}
        {...stepProps}
        onStepCompleted={_.partial(onStepCompleted, part.id)}
        freeResponseValue={step.temp_free_response}
        step={step}
        waitingText={waitingText}
        controlButtons={controlButtons}

        canReview={StepPanel.canReview(part.id)}
        disabled={TaskStepStore.isSaving(part.id)}
        isContinueEnabled={StepPanel.canContinue(part.id)}

        getCurrentPanel={getCurrentPanel}
        getReadingForStep={getReadingForStep}
        setFreeResponseAnswer={TaskStepActions.setFreeResponseAnswer}
        onFreeResponseChange={_.partial(TaskStepActions.updateTempFreeResponse, part.id)}
        freeResponseValue={TaskStepStore.getTempFreeResponse(part.id)}
        setAnswerId={TaskStepActions.setAnswerId}/>
    </div>

module.exports = {ExerciseControlButtons, ExercisePart, canOnlyContinue, getCurrentPanel}
