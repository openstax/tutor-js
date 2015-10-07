React = require 'react/addons'
Router = require 'react-router'
moment = require 'moment'
{PureRenderMixin} = React.addons

BS = require 'react-bootstrap'
ArbitraryHtmlAndMath = require '../../html'
StepMixin = require '../step-mixin'
StepFooterMixin = require '../step-footer-mixin'
BindStoreMixin = require '../../bind-store-mixin'

Question = require '../../question'
FreeResponse = require './free-response'
ExerciseGroup = require './group'
AsyncButton = require '../../buttons/async-button'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskActions, TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'


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

  render: ->
    {content, disabled} = @props
    question = content.questions[0]

    {freeResponse} = @state

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
      <div className="exercise-uid">{content.uid}</div>
    </div>


ExMultiChoice = React.createClass
  displayName: 'ExMultiChoice'
  propTypes:
    content: React.PropTypes.object.isRequired
    free_response: React.PropTypes.string.isRequired
    correct_answer_id: React.PropTypes.string.isRequired
    answer_id: React.PropTypes.string.isRequired
    isReady: React.PropTypes.bool.isRequired
    onAnswerChanged: React.PropTypes.func

  getDefaultProps: ->
    answer_id: ''

  getInitialState: ->
    {answer_id} = @props
    answerId: answer_id

  onAnswerChanged: (answer) ->
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  render: ->
    {content, free_response, correct_answer_id, isReady} = @props
    question = content.questions[0]

    {answerId} = @state

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



ExerciseFreeResponse = React.createClass
  displayName: 'ExerciseFreeResponse'
  propTypes:
    id: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired

  bindStore: TaskStepStore

  statics:
    isContinueEnabled: (id) ->
      {free_response, content} = TaskStepStore.get(id)
      response = free_response or @state.freeResponse
      response?.trim().length > 0

  render: ->
    {id, focus} = @props
    {content} = TaskStepStore.get(id)
    disabled = TaskStepStore.isSaving(id)

    <ExFreeResponse
      disabled={disabled}
      content={content}
      focus={focus}/>


ExerciseMultiChoice = React.createClass
  displayName: 'ExerciseMultiChoice'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func

  statics:
    isContinueEnabled: (id) ->
      {answer_id} = TaskStepStore.get(id)
      !!answer_id

  onContinue: ->
    {id, onNextStep, onStepCompleted} = @props
    canReview = StepPanel.canReview id

    onStepCompleted()
    onNextStep() unless canReview

  onAnswerChanged: (answer) ->
    {id} = @props
    TaskStepActions.setAnswerId(id, answer.id)

  render: ->
    {id} = @props
    multiChoiceProps = TaskStepStore.get(id)
    isReady = not TaskStepStore.isLoading(id) and not TaskStepStore.isSaving(id)

    <ExMultiChoice
      {...multiChoiceProps}
      isReady={isReady}
      onAnswerChanged={@onAnswerChanged}
    />


ExerciseReview = React.createClass
  displayName: 'ExerciseReview'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  statics:
    isContinueEnabled: (id) ->
      {answer_id} = TaskStepStore.get(id)
      !!answer_id and not TaskStepStore.isRecovering(id)

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

  canRefreshMemory: ->
    {id} = @props
    step = TaskStepStore.get(id)
    step?.related_content.length and step.has_recovery and step.correct_answer_id isnt step.answer_id

  continueButtonText: ->
    {id} = @props
    task = TaskStore.get(TaskStepStore.getTaskId(id))
    if TaskStepStore.canTryAnother(id, task) then 'Move On' else 'Continue'

  renderFooterButtons: ->
    {id, review} = @props
    task = TaskStore.get(TaskStepStore.getTaskId(id))

    if TaskStepStore.canTryAnother(id, task)
      tryAnotherButton = <AsyncButton
        bsStyle='primary'
        className='-try-another'
        key='step-try-another'
        onClick={@tryAnother}
        isWaiting={TaskStepStore.isRecovering(id)}
        waitingText='Loading Another…'>
        Try Another
      </AsyncButton>

    # "Refresh my Memory" button is disabled until BE gets it working properly.
    # See corresponding comment in tests.
    # if @canRefreshMemory()
    #   refreshMemoryButton = <BS.Button
    #     bsStyle='primary'
    #     className='-refresh-memory'
    #     onClick={@refreshMemory}>
    #     Refresh My Memory
    #   </BS.Button>

    <div className='task-footer-buttons' key='step-buttons'>
      {tryAnotherButton}
      {@renderContinueButton() unless review is 'completed'}
    </div>

  render: ->
    {id} = @props
    reviewProps = TaskStepStore.get(id)

    <ExReview {...reviewProps}/>


ExerciseTeacherReadOnly = React.createClass
  displayName: 'ExerciseTeacherReadOnly'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  statics:
    isContinueEnabled: (id) ->
      {answer_id} = TaskStepStore.get(id)
      !!answer_id

  onContinue: ->
    @props.onNextStep()

  render: ->
    {id} = @props
    reviewProps = TaskStepStore.get(id)

    <ExReview {...reviewProps}/>

module.exports = {ExerciseFreeResponse, ExerciseMultiChoice, ExerciseReview, ExerciseTeacherReadOnly}
