React = require 'react/addons'
BS = require 'react-bootstrap'

{PureRenderMixin} = React.addons

ArbitraryHtmlAndMath = require '../../html'
Question = require '../../question'
FreeResponse = require './free-response'
AsyncButton = require '../../buttons/async-button'

ExerciseGroup = require './group'
StepFooter = require '../step-footer'
{CardBody} = require '../../pinned-header-footer-card/sections'

PANELS =
  'free-response': ExFreeResponse
  'multiple-choice': ExMultipleChoice
  'review': ExReview
  'teacher-read-only': ExReview

CONTROLS =
  'free-response': ExContinueButton
  'multiple-choice': ExContinueButton
  'review': ExReviewOptions
  'teacher-read-only': ExContinueButton


ExContinueButton = React.createClass
  displayName: 'ExContinueButton'
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


ExReviewOptions = React.createClass
  displayName: 'ExReviewOptions'
  getDefaultProps: ->
    review: ''
    canTryAnother: false
    isRecovering: false
    canRefreshMemory: false

  render: ->
    {review, canTryAnother, tryAnother, isRecovering} = @props
    {canRefreshMemory, refreshMemory} = @props
    {isContinueFailed, waitingText, onContinue, isContinueEnabled} = @props

    continueButtonText = if canTryAnother then 'Move On' else ''

    if canTryAnother
      tryAnotherButton = <AsyncButton
        bsStyle='primary'
        className='-try-another'
        key='step-try-another'
        onClick={tryAnother}
        isWaiting={isRecovering}
        waitingText='Loading Another…'>
        Try Another
      </AsyncButton>

    if canRefreshMemory
      refreshMemoryButton = <BS.Button
        bsStyle='primary'
        className='-refresh-memory'
        onClick={refreshMemory}>
        Refresh My Memory
      </BS.Button>

    continueButton =
      <ExContinueButton
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
  propTypes:
    content: React.PropTypes.object.isRequired
    focus: React.PropTypes.bool.isRequired
    disabled: React.PropTypes.bool
    free_response: React.PropTypes.string
    onFreeResponseChange: React.PropTypes.func

  getDefaultProps: ->
    disabled: false
    free_response: ''

  componentDidMount: ->
    @focusBox()
  componentDidUpdate: ->
    @focusBox()

  focusBox: ->
    @refs.freeResponse.getDOMNode().focus() if @props.focus

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse.getDOMNode().value
    @props.onFreeResponseChange?(freeResponse)

  render: ->
    {content, disabled, onFreeResponseChange, free_response} = @props
    question = content.questions[0]

    <div className='exercise'>
      <ArbitraryHtmlAndMath className='stimulus' block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className='stem' block={true} html={question.stem_html} />
      <textarea
        disabled={disabled}
        ref='freeResponse'
        placeholder='Enter your response'
        defaultValue={free_response}
        onChange={@onFreeResponseChange}
      />
      <div className="exercise-uid">{content.uid}</div>
    </div>

ExMultipleChoice = React.createClass
  displayName: 'ExMulitpleChoice'
  getDefaultProps: ->
    answer_id: ''

  getInitialState: ->
    {answer_id} = @props
    answerId: answer_id

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
        <div className='multiple-choice-prompt'>Choose the best answer from the following:</div>
      </Question>
    </div>

ExReview = React.createClass
  displayName: 'ExReview'
  propTypes:
    content: React.PropTypes.object.isRequired
    feedback_html: React.PropTypes.string.isRequired
    correct_answer_id: React.PropTypes.string.isRequired
    answer_id: React.PropTypes.string.isRequired
    free_response: React.PropTypes.string

  render: ->
    {content, free_response, answer_id, correct_answer_id, feedback_html, onChangeAnswerAttempt} = @props
    question = content.questions[0]

    <div className='exercise'>
      <Question
        key='step-question'
        model={question}
        answer_id={answer_id}
        exercise_uid={content.uid}
        correct_answer_id={correct_answer_id}
        feedback_html={feedback_html}
        onChangeAttempt={onChangeAnswerAttempt}>
        <FreeResponse free_response={free_response}/>
      </Question>
    </div>



ExerciseFreeResponse = React.createClass
  displayName: 'ExerciseFreeResponse'
  propTypes:
    step: React.PropTypes.shape(
      content: React.PropTypes.object.isRequired
    ).isRequired
    focus: React.PropTypes.bool.isRequired
    disabled: React.PropTypes.bool
    onFreeResponseChange: React.PropTypes.func

  getDefaultProps: ->
    disabled: false
    defaultFreeResponse: ''
    isContinueEnabled: true

  getInitialState: ->
    {step} = @props

    freeResponse: step.free_response

  onFreeResponseChange: (freeResponse) ->
    @setState {freeResponse}
    @props.onFreeResponseChange?(freeResponse)

  isContinueEnabled: ->
    {freeResponse} = @state
    freeResponse?.trim().length > 0
  
  render: ->
    {disabled, focus, step} = @props
    {group, related_content} = step

    {isContinueFailed, waitingText, onContinue, isContinueEnabled, continueButtonText} = @props

    <div className='exercise-free-response'>
      <ExFreeResponse
        {...step}
        disabled={disabled}
        focus={focus}
        onFreeResponseChange={@onFreeResponseChange}/>

      <ExContinueButton
        isContinueFailed={isContinueFailed}
        waitingText={waitingText}
        onContinue={_.partial(onContinue, @state)}
        isContinueEnabled={isContinueEnabled and @isContinueEnabled()}>
        {continueButtonText}
      </ExContinueButton>
    </div>


ExerciseMultiChoice = React.createClass
  displayName: 'ExerciseMultiChoice'
  propTypes:
    step: React.PropTypes.shape(
      content: React.PropTypes.object.isRequired
      correct_answer_id: React.PropTypes.string
      answer_id: React.PropTypes.string
      free_response: React.PropTypes.string
    ).isRequired
    isReady: React.PropTypes.bool.isRequired
    onAnswerChanged: React.PropTypes.func

  getDefaultProps: ->
    isContinueEnabled: true

  onAnswerChanged: (answer) ->
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  onContinue: ->
    {canReview, onNextStep, onStepCompleted} = @props

    onStepCompleted()
    onNextStep() unless canReview

  isContinueEnabled: ->
    {answerId} = @state
    answerId?.length > 0

  render: ->
    {step} = @props
    {group, related_content} = step
    {isContinueFailed, waitingText, isContinueEnabled, continueButtonText} = @props
    isReady = not waitingText

    <div className='exercise-multiple-choice'>
      <ExMultipleChoice
        {...step}
        choicesEnabled={isReady}
        onAnswerChanged={@onAnswerChanged}
      />
      <ExContinueButton
        isContinueFailed={isContinueFailed}
        waitingText={waitingText}
        onContinue={_.partial(@onContinue, @state)}
        isContinueEnabled={isContinueEnabled and @isContinueEnabled()}>
        {continueButtonText}
      </ExContinueButton>
    </div>


ExerciseReview = React.createClass
  displayName: 'ExerciseReview'
  propTypes:
    step: React.PropTypes.shape(
      content: React.PropTypes.object.isRequired
      feedback_html: React.PropTypes.string.isRequired
      correct_answer_id: React.PropTypes.string.isRequired
      answer_id: React.PropTypes.string.isRequired
      free_response: React.PropTypes.string
    ).isRequired
    onChangeAnswerAttempt: React.PropTypes.func
  mixins: [PureRenderMixin]

  onChangeAnswerAttempt: (answer) ->
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')
    @props.onChangeAnswerAttempt?(answer)

  render: ->
    {step} = @props
    {group, related_content} = step
    reviewOptionsProps = _.pick(@props,
      'review', 'canTryAnother', 'tryAnother', 'isRecovering',
      'isContinueFailed', 'waitingText', 'onContinue', 'isContinueEnabled', 'continueButtonText')

    <div className='exercise-review'>
      <ExReview {...step} onChangeAttempt={@onChangeAnswerAttempt}/>
      <ExReviewOptions {...reviewOptionsProps}/>
    </div>

ExerciseStepCard = React.createClass
  displayName: 'ExerciseStepCard'
  render: ->
    {step, type, pinned} = @props
    {group, related_content} = step
    ExPanel = PANELS[type]
    ControlButtons = CONTROLS[type]

    controlOptions = ['review', 'canTryAnother', 'tryAnother', 'isRecovering',
      'isContinueFailed', 'waitingText', 'onContinue', 'isContinueEnabled', 'continueButtonText']

    notPanelOptions = _.union(controlOptions, ['step', 'type'])

    controlOptionsProps = _.pick(@props, controlOptions)

    panelProps = _.omit(@props, notPanelOptions)
    panelProps.choicesEnabled = not waitingText

    controlButtons = <ControlButtons {...controlOptionsProps}/>

    footer = <StepFooter
      {...@props}
      controlButtons={controlButtons}
    />

    <CardBody className='task-step' footer={footer} pinned={pinned}>
      <div className="exercise-#{type}">
        <ExPanel {...panelProps}/>
        <ExerciseGroup
          key='step-exercise-group'
          group={group}
          related_content={related_content}/>
      </div>
    </CardBody>

module.exports = {ExerciseFreeResponse, ExerciseMultiChoice, ExerciseReview}
