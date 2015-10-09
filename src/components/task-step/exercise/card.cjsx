React = require 'react'
_ = require 'underscore'

ExerciseGroup = require './group'
StepFooter = require '../step-footer'
{CardBody} = require '../../pinned-header-footer-card/sections'

{ExContinueButton, ExReviewControls, ExFreeResponse, ExMultipleChoice, ExReview} = require './modes'

PANELS =
  'free-response': ExFreeResponse
  'multiple-choice': ExMultipleChoice
  'review': ExReview
  'teacher-read-only': ExReview

CONTROLS =
  'free-response': ExContinueButton
  'multiple-choice': ExContinueButton
  'review': ExReviewControls
  'teacher-read-only': ExContinueButton

CONTINUE_CHECKS =
  'free-response': 'freeResponse'
  'multiple-choice': 'answerId'
  'review': null
  'teacher-read-only': null

ON_CHANGE =
  'free-response': 'onFreeResponseChange'
  'multiple-choice': 'onAnswerChanged'
  'review': 'onChangeAnswerAttempt'
  'teacher-read-only': 'onChangeAnswerAttempt'


CONTROL_PROPS = ['review', 'canTryAnother', 'tryAnother', 'isRecovering',
  'isContinueFailed', 'waitingText', 'continueButtonText']

FOOTER_PROPS = ['pinned', 'courseId', 'id', 'taskId', 'review']

NOT_PANEL_PROPS = _.union(
  CONTROL_PROPS,
  FOOTER_PROPS,
  ['panel', 'onContinue', 'isContinueEnabled', 'step']
)


ExerciseStepCard = React.createClass
  displayName: 'ExerciseStepCard'
  getDefaultProps: ->
    disabled: false
    isContinueEnabled: true

  getInitialState: ->
    {step} = @props
    freeResponse: step.free_response

  isContinueEnabled: ->
    {panel} = @props
    toCheck = CONTINUE_CHECKS[panel]
    return true unless toCheck?
    @state[toCheck]?.trim().length > 0

  onAnswerChanged: (answer) ->
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  onFreeResponseChange: (freeResponse) ->
    @setState {freeResponse}
    @props.onFreeResponseChange?(freeResponse)

  onChangeAnswerAttempt: (answer) ->
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')
    @props.onChangeAnswerAttempt?(answer)

  onContinue: ->
    {panel, canReview, onNextStep, onStepCompleted, onContinue} = @props

    if onContinue?
      onContinue(@state)
      return

    if panel is 'multiple-choice'
      onStepCompleted()
      onNextStep() unless canReview

  render: ->
    {step, panel, pinned, isContinueEnabled, waitingText} = @props
    {group, related_content} = step

    ExPanel = PANELS[panel]
    ControlButtons = CONTROLS[panel]
    onInputChange = ON_CHANGE[panel]

    controlProps = _.pick(@props, CONTROL_PROPS)
    controlProps.isContinueEnabled = isContinueEnabled and @isContinueEnabled()
    controlProps.onContinue = @onContinue

    panelProps = _.omit(@props, NOT_PANEL_PROPS)
    panelProps.choicesEnabled = not waitingText
    panelProps[onInputChange] = @[onInputChange]

    footerProps = _.pick(@props, FOOTER_PROPS)

    controlButtons = <ControlButtons {...controlProps}/>

    footer = <StepFooter
      {...footerProps}
      controlButtons={controlButtons}
    />

    <CardBody className='task-step' footer={footer} pinned={pinned}>
      <div className="exercise-#{panel}">
        <ExPanel
          {...step}
          {...panelProps}/>
        <ExerciseGroup
          key='step-exercise-group'
          group={group}
          related_content={related_content}/>
      </div>
    </CardBody>

module.exports = ExerciseStepCard
