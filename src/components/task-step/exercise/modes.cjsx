React = require 'react/addons'
BS = require 'react-bootstrap'

{PureRenderMixin} = React.addons

ArbitraryHtmlAndMath = require '../../html'
Question = require '../../question'
FreeResponse = require './free-response'
AsyncButton = require '../../buttons/async-button'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskActions, TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'


ExContinueButton = React.createClass
  displayName: 'ExContinueButton'
  getDefaultProps: ->
    isContinueFailed: false
    waitingText: null

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
    defaultFreeResponse: React.PropTypes.string
    onFreeResponseChange: React.PropTypes.func

  getDefaultProps: ->
    disabled: false
    defaultFreeResponse: ''
    isContinueEnabled: true

  getInitialState: ->
    {defaultFreeResponse} = @props
    freeResponse: defaultFreeResponse

  componentDidMount: ->
    @focusBox()
  componentDidUpdate: ->
    @focusBox()

  focusBox: ->
    @refs.freeResponse.getDOMNode().focus() if @props.focus

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse.getDOMNode().value
    @setState {freeResponse}

    @props.onFreeResponseChange?(freeResponse)

  isContinueEnabled: ->
    {freeResponse} = @state
    freeResponse?.trim().length > 0
  
  render: ->
    {content, disabled} = @props
    question = content.questions[0]
    {freeResponse} = @state

    {isContinueFailed, waitingText, onContinue, isContinueEnabled, continueButtonText} = @props

    <div className='exercise-free-response'>
      <ArbitraryHtmlAndMath className='stimulus' block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className='stem' block={true} html={question.stem_html} />
      <textarea
        disabled={disabled}
        ref='freeResponse'
        placeholder='Enter your response'
        value={freeResponse}
        onChange={@onFreeResponseChange}
      />

      <ExContinueButton
        isContinueFailed={isContinueFailed}
        waitingText={waitingText}
        onContinue={_.partial(onContinue, @state)}
        isContinueEnabled={isContinueEnabled and @isContinueEnabled()}>
        {continueButtonText}
      </ExContinueButton>

      <div className="exercise-uid">{content.uid}</div>
    </div>


ExMultiChoice = React.createClass
  displayName: 'ExMultiChoice'
  propTypes:
    content: React.PropTypes.object.isRequired
    free_response: React.PropTypes.string.isRequired
    isReady: React.PropTypes.bool.isRequired
    correct_answer_id: React.PropTypes.string
    answer_id: React.PropTypes.string
    onAnswerChanged: React.PropTypes.func

  getDefaultProps: ->
    answer_id: ''
    isContinueEnabled: true

  getInitialState: ->
    {answer_id} = @props
    answerId: answer_id

  onAnswerChanged: (answer) ->
    return if answer.id is @state.answerId
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  isContinueEnabled: ->
    {answerId} = @state
    answerId?.length > 0

  render: ->
    {content, free_response, correct_answer_id, isReady} = @props
    question = content.questions[0]
    {answerId} = @state

    {isContinueFailed, waitingText, onContinue, isContinueEnabled, continueButtonText} = @props

    <div className='exercise-multiple-choice'>
      <Question
        answer_id={answerId}
        onChange={@onAnswerChanged}
        choicesEnabled={isReady}
        model={question}
        exercise_uid={content.uid}
        correct_answer_id={correct_answer_id}>
        <FreeResponse free_response={free_response}/>
        <div className='multiple-choice-prompt'>Choose the best answer from the following:</div>
      </Question>

      <ExContinueButton
        isContinueFailed={isContinueFailed}
        waitingText={waitingText}
        onContinue={_.partial(onContinue, @state)}
        isContinueEnabled={isContinueEnabled and @isContinueEnabled()}>
        {continueButtonText}
      </ExContinueButton>
    </div>


ExReview = React.createClass
  displayName: 'ExReview'
  propTypes:
    content: React.PropTypes.object.isRequired
    free_response: React.PropTypes.string.isRequired
    feedback_html: React.PropTypes.string.isRequired
    correct_answer_id: React.PropTypes.string.isRequired
    answer_id: React.PropTypes.string.isRequired
    onChangeAnswerAttempt: React.PropTypes.func
  mixins: [PureRenderMixin]

  onChangeAnswerAttempt: (answer) ->
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')
    @props.onChangeAnswerAttempt?(answer)

  render: ->
    {content, free_response, answer_id, correct_answer_id, feedback_html} = @props
    question = content.questions[0]

    reviewOptionsProps = _.pick(@props,
      'review', 'canTryAnother', 'tryAnother', 'isRecovering',
      'isContinueFailed', 'waitingText', 'onContinue', 'isContinueEnabled', 'continueButtonText')

    <div className='exercise-review'>
      <Question
        key='step-question'
        model={question}
        answer_id={answer_id}
        exercise_uid={content.uid}
        correct_answer_id={correct_answer_id}
        feedback_html={feedback_html}
        onChangeAttempt={@onChangeAnswerAttempt}>
        <FreeResponse free_response={free_response}/>
      </Question>

      <ExReviewOptions {...reviewOptionsProps}/>
    </div>


ExerciseFreeResponse = React.createClass
  displayName: 'ExerciseFreeResponse'
  propTypes:
    id: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired

  onContinue: (state) ->
    {id} = @props
    {freeResponse} = state
    TaskStepActions.setFreeResponseAnswer(id, freeResponse)

  render: ->
    {id, focus, waitingText, isContinueFailed} = @props
    {content} = TaskStepStore.get(id)
    disabled = TaskStepStore.isSaving(id)

    <ExFreeResponse
      disabled={disabled}
      content={content}
      focus={focus}
      onContinue={@onContinue}
      waitingText={waitingText}
      isContinueFailed={isContinueFailed}
    />


ExerciseMultiChoice = React.createClass
  displayName: 'ExerciseMultiChoice'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func

  onContinue: ->
    {id, onNextStep, onStepCompleted} = @props
    canReview = StepPanel.canReview id

    onStepCompleted()
    onNextStep() unless canReview

  onAnswerChanged: (answer) ->
    {id} = @props
    TaskStepActions.setAnswerId(id, answer.id)

  render: ->
    {id, waitingText, isContinueFailed} = @props
    multiChoiceProps = TaskStepStore.get(id)
    isReady = not TaskStepStore.isLoading(id) and not TaskStepStore.isSaving(id)

    <ExMultiChoice
      {...multiChoiceProps}
      isReady={isReady}
      onAnswerChanged={@onAnswerChanged}
      onContinue={@onContinue}
      waitingText={waitingText}
      isContinueFailed={isContinueFailed}
    />


ExerciseReview = React.createClass
  displayName: 'ExerciseReview'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  onContinue: ->
    @props.onNextStep()

  tryAnother: ->
    {id} = @props
    @props.recoverFor(id)

  refreshMemory: ->
    {id} = @props
    task_id = TaskStepStore.getTaskId(id)
    {index} = TaskStore.getReadingForTaskId(task_id, id)
    throw new Error('BUG: No reading found for task') unless index

    # Track what step is refreshed so that it can be skipped after refreshing.
    @props.refreshStep(index, id)

  render: ->
    {id, review, waitingText, isContinueFailed} = @props
    reviewProps = TaskStepStore.get(id)

    task = TaskStore.get(TaskStepStore.getTaskId(id))
    canTryAnother = TaskStepStore.canTryAnother(id, task)

    <ExReview
      {...reviewProps}
      review={review}
      canTryAnother={canTryAnother}
      tryAnother={@tryAnother}
      refreshMemory={@refreshMemory}
      onContinue={@onContinue}
      waitingText={waitingText}
      isContinueFailed={isContinueFailed}
    />


ExerciseTeacherReadOnly = React.createClass
  displayName: 'ExerciseTeacherReadOnly'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  onContinue: ->
    @props.onNextStep()

  render: ->
    {id, review, waitingText, isContinueFailed} = @props
    reviewProps = TaskStepStore.get(id)

    <ExReview
      {...reviewProps}
      review={review}
      onContinue={@onContinue}
      waitingText={waitingText}
      isContinueFailed={isContinueFailed}
    />

module.exports = {ExerciseFreeResponse, ExerciseMultiChoice, ExerciseReview, ExerciseTeacherReadOnly}
