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

module.exports = {ExerciseControlButtons, canOnlyContinue, getCurrentPanel}
