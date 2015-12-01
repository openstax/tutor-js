React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

ArbitraryHtmlAndMath = require '../html'
Question = require '../question'
FreeResponse = require './free-response'
AsyncButton = require '../buttons/async-button'

ExerciseGroup = require './group'
{CardBody} = require '../pinned-header-footer-card/sections'

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
  getDefaultProps: ->
    disabled: false
    free_response: ''

  getInitialState: ->
    freeResponse: @props.free_response

  componentDidMount: ->
    @focusBox()
  componentDidUpdate: ->
    @focusBox()

  componentWillReceiveProps: (nextProps) ->
    if @state.freeResponse isnt nextProps.free_response
      @setState(freeResponse: nextProps.free_response)

  focusBox: ->
    @refs.freeResponse.getDOMNode().focus() if @props.focus

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse.getDOMNode().value
    @setState({freeResponse})
    @props.onFreeResponseChange?(freeResponse)

  render: ->
    {content, disabled, onFreeResponseChange, free_response} = @props
    {freeResponse} = @state
    question = content.questions[0]

    <div className='exercise'>
      <ArbitraryHtmlAndMath className='stimulus' block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className='stem' block={true} html={question.stem_html} />
      <textarea
        disabled={disabled}
        ref='freeResponse'
        placeholder='Enter your response'
        value={freeResponse}
        onChange={@onFreeResponseChange}
      />
      <div className="exercise-uid">{content.uid}</div>
    </div>


ExMultipleChoice = React.createClass
  displayName: 'ExMulitpleChoice'
  propTypes: propTypes.ExMulitpleChoice
  getDefaultProps: ->
    answer_id: ''

  getInitialState: ->
    {answer_id} = @props
    answerId: answer_id

  componentWillReceiveProps: (nextProps) ->
    if @state.answerId isnt nextProps.answer_id
      @setState(answerId: nextProps.answer_id)

  onAnswerChanged: (answer) ->
    return if answer.id is @state.answerId
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  render: ->
    {content, free_response, correct_answer_id, choicesEnabled} = @props
    question = content.questions[0]
    {answerId} = @state

    <div className='exercise'>
      <Question
        answer_id={answerId}
        onChange={@onAnswerChanged}
        choicesEnabled={choicesEnabled}
        model={question}
        exercise_uid={content.uid}
        correct_answer_id={correct_answer_id}>
        <FreeResponse free_response={free_response}/>
      </Question>
    </div>


ExReview = React.createClass
  displayName: 'ExReview'
  propTypes: propTypes.ExReview

  render: ->
    {content, free_response, answer_id, correct_answer_id, feedback_html, type, onChangeAnswerAttempt} = @props
    question = content.questions[0]

    <div className='exercise'>
      <Question
        key='step-question'
        model={question}
        answer_id={answer_id}
        exercise_uid={content.uid}
        correct_answer_id={correct_answer_id}
        feedback_html={feedback_html}
        type={type}
        onChangeAttempt={onChangeAnswerAttempt}>
        <FreeResponse free_response={free_response}/>
      </Question>
    </div>


module.exports = {
  ExContinueButton,
  ExReviewControls,
  ExFreeResponse,
  ExMultipleChoice,
  ExReview
}
