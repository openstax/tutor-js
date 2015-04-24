_ = require 'underscore'
moment = require 'moment'
React = require 'react'
katex = require 'katex'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskActions,TaskStore} = require '../../flux/task'
ArbitraryHtmlAndMath = require '../html'
StepMixin = require './step-mixin'
Question = require '../question'
BS = require 'react-bootstrap'


ExerciseFreeResponse = React.createClass
  displayName: 'ExerciseFreeResponse'
  propTypes:
    id: React.PropTypes.number.isRequired

  mixins: [StepMixin]

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

    <div className="exercise">
      <ArbitraryHtmlAndMath className="stimulus" block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className="stem" block={true} html={question.stem_html} />
      <textarea
        ref="freeResponse"
        placeholder="Enter your response"
        value={@state.freeResponse or ''}
        onChange={@onFreeResponseChange}
        />
    </div>

  componentDidMount: -> @refs.freeResponse.getDOMNode().focus()

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse.getDOMNode().value
    @setState {freeResponse}

  onContinue: ->
    {id} = @props
    {freeResponse} = @state
    TaskStepActions.setFreeResponseAnswer(id, freeResponse)


ExerciseMultiChoice = React.createClass
  displayName: 'ExerciseMultiChoice'
  mixins: [StepMixin]
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)

    # TODO: Assumes 1 question.
    question = content.questions[0]
    FreeResponse = if TaskStepStore.hasFreeResponse(id) then <div className="free-response">{free_response}</div> else ''

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      {FreeResponse}
      <div className="multiple-choice-prompt">Choose the best answer from the following:</div>
    </Question>

  onAnswerChanged: (answer) ->
    {id} = @props
    TaskStepActions.setAnswerId(id, answer.id)

  isContinueEnabled: ->
    {id} = @props
    {answer_id} = TaskStepStore.get(id)
    !!answer_id

  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep?()


ExerciseReview = React.createClass
  displayName: 'ExerciseReview'
  mixins: [StepMixin]
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)

    # TODO: Assumes 1 question.
    question = content.questions[0]
    FreeResponse = if TaskStepStore.hasFreeResponse(id) then <div className="free-response">{free_response}</div> else ''

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      {FreeResponse}
    </Question>

  onAnswerChanged: (answer) ->
    console.log(answer)

  isContinueEnabled: ->
    {id} = @props
    {answer_id} = TaskStepStore.get(id)
    !!answer_id

  onContinue: ->
    @props.onNextStep()

  tryAnother: ->
    {id} = @props
    task_id = TaskStepStore.getTaskId(id)
    TaskStepActions.loadRecovery(id)
    TaskActions.load(task_id)

  refreshMemory: ->
    {index} = TaskStore.getReadingForTaskId(@props.id)
    throw new Error('BUG: No reading found for task') unless index
    # goToStep returns an function with the step index in closure scope
    @props.goToStep(index)()

  canTryAnother: ->
    {id} = @props
    step = TaskStepStore.get(id)
    return step.has_recovery and step.correct_answer_id isnt step.answer_id

  renderFooterButtons: ->
    # TODO: switch to using classnames library
    buttonClasses = '-continue'
    buttonClasses += 'disabled' unless @isContinueEnabled()
    continueButton =
      <BS.Button bsStyle="primary" className={buttonClasses} onClick={@onContinue}>
        { if @canTryAnother() then "Move On" else "Continue" }
      </BS.Button>
    if @canTryAnother()
      extraButtons = [
        <BS.Button bsStyle="primary" className="-try-another" onClick={@tryAnother}>
          Try Another
        </BS.Button>
        <BS.Button bsStyle="primary" className="-refresh-memory" onClick={@refreshMemory}>
          Refresh My Memory
        </BS.Button>
      ]
    <div className="footer-buttons">
      {extraButtons}
      {continueButton}
    </div>


module.exports = React.createClass
  displayName: 'Exercise'
  propTypes:
    id: React.PropTypes.number.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func.isRequired

  render: ->
    {id} = @props
    step = TaskStepStore.get(id)
    task = TaskStore.get(step.task_id)
    {id, content, free_response, is_completed} = step
    # TODO: Assumes 1 question.
    hasFreeResponse = TaskStepStore.hasFreeResponse(id)

    # This should handle the 4 different states an Exercise can be in:
    # 1. `not(free_response)`: Show the question stem and a text area
    # 2. `free_response and not(is_completed)`: Show stem, your free_response, and the multiple choice options
    # 3. `correct_answer`: review how you did and show feedback (if any)
    # 4. `task.is_completed and answer` show your answer choice but no option to change it

    # This should also handle when an Exercise format is a True-False:
    # 5.  `question.formats` does not have 'free-response' and not(is_completed): Show stem and true-false options
    # 6.  `question.formats` does not have 'free-response' and `correct_answer`: review how you did and show feedback (if any)

    if (is_completed and not (task.type is 'homework')) or (is_completed and task.type is 'homework' and moment().isAfter(task.due_at, 'day'))
      # 3. `correct_answer`: review how you did and show feedback (if any)
      # 6.  `question.formats` does not have 'free-response' and `correct_answer`: review how you did and show feedback (if any)
      exercise = <ExerciseReview
        id={id}
        onNextStep={@props.onNextStep}
        goToStep={@props.goToStep}
        onStepCompleted={@props.onStepCompleted}
      />
    else if free_response or not hasFreeResponse
      # 2. `free_response and not(is_completed)`: Show stem, your free_response, and the multiple choice options
      # 5.  `question.formats` does not have 'free-response' and not(is_completed): Show stem and true-false options
      exercise = <ExerciseMultiChoice
        id={id}
        onStepCompleted={@props.onStepCompleted}
      />

      exercise.props.onNextStep = @props.onNextStep if (task.type is 'homework' and moment().isBefore(task.due_at, 'day'))
    else
      # 1. `not(free_response)`: Show the question stem and a text area
      exercise = <ExerciseFreeResponse
        id={id}
      />

    exercise
