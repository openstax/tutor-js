React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

AsyncButton = require '../buttons/async-button'
{propTypes, props} = require './props'

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

ExContinueButton = React.createClass
  displayName: 'ExContinueButton'
  propTypes: propTypes.ExContinueButton
  getDefaultProps: ->
    isContinueFailed: false
    waitingText: null
    isContinueEnabled: true

  render: ->
    {isContinueEnabled, isContinueFailed, waitingText, onContinue, children} = @props
    buttonText = children or 'Continue'

    <AsyncButton
      bsStyle='primary'
      className='continue'
      key='step-continue'
      onClick={onContinue}
      disabled={not isContinueEnabled}
      isWaiting={!!waitingText}
      waitingText={waitingText}
      isFailed={isContinueFailed}
      >
      {buttonText}
    </AsyncButton>


ExReviewControls = React.createClass
  displayName: 'ExReviewControls'
  propTypes: propTypes.ExReviewControls
  getDefaultProps: ->
    review: ''
    canTryAnother: false
    isRecovering: false
    canRefreshMemory: false

  render: ->
    {review, canTryAnother, tryAnother, isRecovering, children} = @props
    {canRefreshMemory, refreshMemory} = @props
    {isContinueFailed, waitingText, onContinue, isContinueEnabled} = @props

    continueButtonText = if canTryAnother then 'Move On' else children

    if canTryAnother
      tryAnotherButton = <AsyncButton
        key='step-try-another'
        bsStyle='primary'
        className='-try-another'
        onClick={tryAnother}
        isWaiting={isRecovering}
        waitingText='Loading Another…'>
        Try Another
      </AsyncButton>

    if canRefreshMemory
      refreshMemoryButton = <BS.Button
        key='step-refresh'
        bsStyle='primary'
        className='-refresh-memory'
        onClick={refreshMemory}>
        Refresh My Memory
      </BS.Button>

    continueButton =
      <ExContinueButton
        key='step-continue'
        isContinueFailed={isContinueFailed}
        waitingText={waitingText}
        onContinue={onContinue}
        isContinueEnabled={isContinueEnabled}>
        {continueButtonText}
      </ExContinueButton> unless review is 'completed'

    <div className='task-footer-buttons' key='step-buttons'>
      {tryAnotherButton}
      {continueButton}
    </div>

ExControlButtons = React.createClass
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


ExerciseDefaultFooter = React.createClass
  displayName: 'ExerciseDefaultFooter'
  render: ->
    <div>{@props.controlButtons}</div>

ExFooter = React.createClass
  displayName: 'ExFooter'
  getDefaultProps: ->
    disabled: false
    isContinueEnabled: false
    allowKeyNext: false
    footer: <ExerciseDefaultFooter/>

  render: ->
    {panel, controlButtons, controlText, footer} = @props

    ControlButtons = CONTROLS[panel]
    controlText ?= CONTROLS_TEXT[panel]

    controlProps = _.pick(@props, props.ExReviewControls)
    controlProps.children = controlText

    controlButtons = <ControlButtons {...controlProps}/>

    footerProps = _.pick(@props, props.StepFooter)
    footerProps.controlButtons = controlButtons or <ControlButtons {...controlProps}/>

    React.addons.cloneWithProps(footer, footerProps)


module.exports = {ExContinueButton, ExReviewControls, ExControlButtons, ExFooter}
