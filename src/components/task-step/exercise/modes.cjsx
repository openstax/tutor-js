React = require 'react'
moment = require 'moment'

BS = require 'react-bootstrap'
ArbitraryHtmlAndMath = require '../../html'
StepMixin = require '../step-mixin'
Question = require '../../question'
FreeResponse = require './free-response'
ExerciseGroup = require './group'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskActions, TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'

ExerciseMixin =
  renderGroup: ->
    {id} = @props
    {group, related_content} = TaskStepStore.get(id)

    <ExerciseGroup group={group} related_content={related_content}/>


ExerciseFreeResponse = React.createClass
  displayName: 'ExerciseFreeResponse'
  propTypes:
    id: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired

  mixins: [StepMixin, ExerciseMixin]

  getInitialState: ->
    {id} = @props
    {free_response} = TaskStepStore.get(id)
    freeResponse: free_response

  isContinueEnabled: ->
    {id} = @props
    {free_response} = TaskStepStore.get(id)
    !! (free_response or @state.freeResponse)

  renderBody: ->
    {id} = @props
    {content} = TaskStepStore.get(id)
    # TODO: Assumes 1 question.
    question = content.questions[0]

    <div className='exercise-free-response'>
      <ArbitraryHtmlAndMath className='stimulus' block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className='stem' block={true} html={question.stem_html} />
      <textarea
        ref='freeResponse'
        placeholder='Enter your response'
        value={@state.freeResponse or ''}
        onChange={@onFreeResponseChange}
        />
    </div>

  componentDidMount: ->
    @refs.freeResponse.getDOMNode().focus() if @props.focus

  componentDidUpdate: ->
    @refs.freeResponse.getDOMNode().focus() if @props.focus

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse.getDOMNode().value
    @setState {freeResponse}

  onContinue: ->
    {id} = @props
    {freeResponse} = @state
    TaskStepActions.setFreeResponseAnswer(id, freeResponse)


ExerciseMultiChoice = React.createClass
  displayName: 'ExerciseMultiChoice'
  mixins: [StepMixin, ExerciseMixin]
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)

    # TODO: Assumes 1 question.
    question = content.questions[0]

    <Question
      model={question}
      answer_id={answer_id}
      correct_answer_id={correct_answer_id}
      onChange={@onAnswerChanged}>
      <FreeResponse id={id} free_response={free_response}/>
      <div className='multiple-choice-prompt'>Choose the best answer from the following:</div>
    </Question>

  onAnswerChanged: (answer) ->
    {id} = @props
    TaskStepActions.setAnswerId(id, answer.id)

  isContinueEnabled: ->
    {id} = @props
    {answer_id} = TaskStepStore.get(id)
    !!answer_id

  onContinue: ->
    {id} = @props
    canReview = StepPanel.canReview id

    @props.onStepCompleted()
    @props.onNextStep() unless canReview

ExerciseReview = React.createClass
  displayName: 'ExerciseReview'
  mixins: [StepMixin, ExerciseMixin]
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  componentWillMount:   ->
    TaskStepStore.on('step.recovered', @goToRecovered)

  componentWillUnmount: ->
    TaskStepStore.off('step.recovered', @goToRecovered)

  loadRecovered: ->
    @props.onNextStep()
    TaskStore.off('change', @loadRecovered)

  goToRecovered: (recoveredStep) ->
    {task_id} = recoveredStep
    TaskStore.on('change', @loadRecovered)
    TaskActions.load(task_id)

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)

    # TODO: Assumes 1 question.
    question = content.questions[0]

    <Question
      model={question}
      answer_id={answer_id}
      correct_answer_id={correct_answer_id}
      feedback_html={feedback_html}
      onChangeAttempt={@onChangeAnswerAttempt}>
      <FreeResponse id={id} free_response={free_response}/>
    </Question>

  onChangeAnswerAttempt: (answer) ->
    # TODO show cannot change answer message here
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')

  isContinueEnabled: ->
    {id} = @props
    {answer_id} = TaskStepStore.get(id)
    !!answer_id

  onContinue: ->
    @props.onNextStep()

  tryAnother: ->
    {id} = @props
    task_id = TaskStepStore.getTaskId(id)
    # emits step.recovered event that is bounded on
    TaskStepActions.loadRecovery(id)

  refreshMemory: ->
    {id} = @props
    task_id = TaskStepStore.getTaskId(id)
    {index} = TaskStore.getReadingForTaskId(task_id, id)
    throw new Error('BUG: No reading found for task') unless index
    # goToStep returns an function with the step index in closure scope
    @props.goToStep(index)()

  canTryAnother: ->
    {id} = @props
    step = TaskStepStore.get(id)
    return step.has_recovery and step.correct_answer_id isnt step.answer_id

  renderFooterButtons: ->
    {review} = @props

    buttonClasses = '-continue'
    buttonClasses += 'disabled' unless @isContinueEnabled()

    unless review
      continueButton =
        <BS.Button bsStyle='primary' className={buttonClasses} onClick={@onContinue}>
          { if @canTryAnother() then 'Move On' else 'Continue' }
        </BS.Button>
    if @canTryAnother()
      extraButtons = [
        <BS.Button bsStyle='primary' className='-try-another' onClick={@tryAnother}>
          Try Another
        </BS.Button>
        <BS.Button bsStyle='primary' className='-refresh-memory' onClick={@refreshMemory}>
          Refresh My Memory
        </BS.Button>
      ]
    <div className='footer-buttons'>
      {extraButtons}
      {continueButton}
    </div>

module.exports = {ExerciseFreeResponse, ExerciseMultiChoice, ExerciseReview}
