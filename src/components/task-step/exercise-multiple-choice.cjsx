_ = require 'underscore'
React = require 'react'
katex = require 'katex'
{TaskActions} = require '../../flux/task'
ArbitraryHtmlAndMath = require '../html'
StepMixin = require './step-mixin'
Question = require '../question'


ExerciseFreeResponse = React.createClass
  mixins: [StepMixin]

  getInitialState: ->
    freeResponse: @props.model.free_response

  isContinueEnabled: ->
    !! (@props.model.free_response or @state.freeResponse)

  renderBody: ->
    {content} = @props.model
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
    {freeResponse} = @state
    TaskActions.setFreeResponseAnswer(@props.task, @props.model, freeResponse)


ExerciseMultiChoice = React.createClass
  mixins: [StepMixin]

  renderBody: ->
    {content, free_response, answer_id, correct_answer_id, feedback_html} = @props.model
    # TODO: Assumes 1 question.
    question = content.questions[0]

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      <div className="free-response">{free_response}</div>
      <div className="multiple-choice-prompt">Choose the best answer from the following:</div>
    </Question>

  onAnswerChanged: (answer) ->
    TaskActions.setAnswerId(@props.task, @props.model, answer.id)

  isContinueEnabled: ->
    !! @props.model.answer_id

  onContinue: ->
    @props.onStepCompleted()


ExerciseReview = React.createClass
  mixins: [StepMixin]

  renderBody: ->
    {content, free_response, answer_id, correct_answer_id, feedback_html} = @props.model
    # TODO: Assumes 1 question.
    question = content.questions[0]

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      <div className="free-response">{free_response}</div>
    </Question>

  isContinueEnabled: ->
    !! @props.model.answer_id

  onContinue: ->
    @props.onNextStep()


module.exports = React.createClass
  displayName: 'Exercise'

  render: ->
    {content, free_response, is_completed} = @props.model
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
        model={@props.model}
        task={@props.task}
        onNextStep={@props.onNextStep}
        onStepCompleted={@props.onStepCompleted}
      />
    else if free_response
      # 2. `free_response and not(is_completed)`: Show stem, your free_response, and the multiple choice options
      <ExerciseMultiChoice
        model={@props.model}
        task={@props.task}
        onStepCompleted={@props.onStepCompleted}
      />
    else
      # 1. `not(free_response)`: Show the question stem and a text area
      <ExerciseFreeResponse
        model={@props.model}
        task={@props.task}
      />
