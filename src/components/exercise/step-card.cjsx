React = require 'react/addons'
_ = require 'underscore'

classnames = require 'classnames'

ExerciseGroup = require './group'
{CardBody} = require '../pinned-header-footer-card/sections'

{
  ExContinueButton,
  ExReviewControls,
  ExFreeResponse,
  ExMultipleChoice,
  ExReview
} = require './modes'

{propTypes, props} = require './props'

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

ExerciseDefaultFooter = React.createClass
  displayName: 'ExerciseDefaultFooter'
  render: ->
    <div>{@props.controlButtons}</div>

ExerciseStepCard = React.createClass
  displayName: 'ExerciseStepCard'
  propTypes:
    propTypes.ExerciseStepCard
  getDefaultProps: ->
    disabled: false
    isContinueEnabled: true
    footer: <ExerciseDefaultFooter/>
  getInitialState: ->
    {step} = @props
    freeResponse: step.free_response
    answerId: step.answer_id

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
    {step, panel, pinned, isContinueEnabled, waitingText, controlButtons, className, footer} = @props
    {group, related_content} = step

    ExPanel = PANELS[panel]
    ControlButtons = CONTROLS[panel]
    onInputChange = ON_CHANGE[panel]

    controlProps = _.pick(@props, props.ExReviewControls)
    controlProps.isContinueEnabled = isContinueEnabled and @isContinueEnabled()
    controlProps.onContinue = @onContinue

    panelProps = _.omit(@props, props.notPanel)
    panelProps.choicesEnabled = not waitingText
    panelProps[onInputChange] = @[onInputChange]

    footerProps = _.pick(@props, props.StepFooter)
    footerProps.controlButtons = controlButtons or <ControlButtons {...controlProps}/>
    footer = React.addons.cloneWithProps(footer, footerProps)

    cardClasses = classnames 'task-step', 'exercise-card', className

    <CardBody className={cardClasses} footer={footer} pinned={pinned}>
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
