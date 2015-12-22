React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

AsyncButton = require '../buttons/async-button'
{ExPanel} = require './panel'
ExerciseGroup = require './group'

{propTypes, props} = require './props'

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


ExFreeResponse = React.createClass
  displayName: 'ExFreeResponse'
  propTypes: propTypes.ExFreeResponse
  render: ->
    <ExPanel {...@props} panel='free-response'/>

ExMultipleChoice = React.createClass
  displayName: 'ExMulitpleChoice'
  propTypes: propTypes.ExMulitpleChoice
  render: ->
    <ExPanel {...@props} panel='multiple-choice'/>

ExReview = React.createClass
  displayName: 'ExReview'
  propTypes: propTypes.ExReview
  render: ->
    <ExPanel {...@props} panel='review'/>

module.exports = {
  ExContinueButton,
  ExReviewControls,
  ExFreeResponse,
  ExMultipleChoice,
  ExReview
}
