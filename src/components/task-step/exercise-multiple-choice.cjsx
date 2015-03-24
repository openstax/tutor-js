_ = require 'underscore'
React = require 'react'
katex = require 'katex'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskActions} = require '../../flux/task'
ArbitraryHtmlAndMath = require '../html'
StepMixin = require './step-mixin'
Question = require '../question'
BS = require 'react-bootstrap'


ExerciseFreeResponse = React.createClass
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
  mixins: [StepMixin]

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)

    # TODO: Assumes 1 question.
    question = content.questions[0]

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      <div className="free-response">{free_response}</div>
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


ExerciseReview = React.createClass
  mixins: [StepMixin]

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)
    # TODO: Assumes 1 question.
    question = content.questions[0]

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      <div className="free-response">{free_response}</div>
    </Question>

  isContinueEnabled: ->
    {id} = @props
    {answer_id} = TaskStepStore.get(id)
    !!answer_id

  onContinue: ->
    @props.onNextStep()

  tryAnother: ->
    task_id = TaskStepStore.getTaskId(@getId())
    TaskStepActions.loadRecovery(@getId())
    TaskActions.load(task_id)

  canTryAnother: ->
    step = TaskStepStore.get(@getId())
    return step.has_recovery and step.correct_answer_id isnt step.answer_id

  renderFooterButtons: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()
    continueButton = <BS.Button bsStyle="primary" className={isDisabledClass} onClick={@onContinue}>Continue</BS.Button>
    tryAnotherButton = <BS.Button bsStyle="primary" onClick={@tryAnother}>Try Another</BS.Button> if @canTryAnother()
    <span>
      {tryAnotherButton}
      {continueButton}
    </span>


module.exports = React.createClass
  displayName: 'Exercise'

  render: ->
    {id} = @props
    step = TaskStepStore.get(id)
    {id, content, free_response, is_completed} = step
    # TODO: Assumes 1 question.
    question = content.questions[0]

    # This should handle the 4 different states an Exercise can be in:
    # 1. `not(free_response)`: Show the question stem and a text area
    # 2. `free_response and not(is_completed)`: Show stem, your free_response, and the multiple choice options
    # 3. `correct_answer`: review how you did and show feedback (if any)
    # 4. `task.is_completed and answer` show your answer choice but no option to change it

    if is_completed
      # 3. `correct_answer`: review how you did and show feedback (if any)
      <ExerciseReview
        id={id}
        onNextStep={@props.onNextStep}
        onStepCompleted={@props.onStepCompleted}
      />
    else if free_response
      # 2. `free_response and not(is_completed)`: Show stem, your free_response, and the multiple choice options
      <ExerciseMultiChoice
        id={id}
        onStepCompleted={@props.onStepCompleted}
      />
    else
      # 1. `not(free_response)`: Show the question stem and a text area
      <ExerciseFreeResponse
        id={id}
      />
