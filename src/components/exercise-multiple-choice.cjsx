_ = require 'underscore'
React = require 'react'
katex = require 'katex'
{AnswerActions, AnswerStore} = require '../flux/answer'
ArbitraryHtmlAndMath = require './html'
StepMixin = require './step-mixin'
Question = require './question'

# Converts an index to `a-z` for question answers
AnswerLabeler = React.createClass
  displayName: 'AnswerLabeler'
  render: ->
    {index, before, after} = @props
    letter = String.fromCharCode(index + 97) # For uppercase use 65
    <span className='answer-char'>{before}{letter}{after}</span>


QuestionMixin =
  # renderBody: ->
  # renderStem: ->
  render: ->
    {model} = @props
    isAnswered = !!model.answer

    if model.stimulus?
      stimulus = <ArbitraryHtmlAndMath block=true className='stimulus' html={model.stimulus} />
    classes = ['question', model.format]
    classes.push('answered') if isAnswered

    if @renderStem?
      stem = @renderStem()
    else
      stem = <ArbitraryHtmlAndMath block=true className='stem' html={model.stem} />

    <div className={classes.join(' ')} data-format={model.type}>
      {stimulus}
      {stem}
      {@renderBody()}
    </div>


SimpleMultipleChoiceOption = React.createClass
  displayName: 'SimpleMultipleChoiceOption'
  render: ->
    {model, questionId, index} = @props
    id = model.id
    <ArbitraryHtmlAndMath className='stem' html={model.content or model.value} />

MultiMultipleChoiceOption = React.createClass
  displayName: 'MultiMultipleChoiceOption'
  render: ->
    {model, idIndices} = @props
    vals = []
    for id, i in idIndices
      unless model.value.indexOf(id) < 0
        index = model.value.indexOf(id)
        vals.push <AnswerLabeler key={index} before='(' after=')' index={index}/>
    <span className='multi'>{vals}</span>


MultipleChoiceOptionMixin =
  render: ->
    {inputType, model, questionId, index, isAnswered} = @props

    # For radio boxes there is only 1 value, the id/value but
    # for checkboxes the answer is an array of ids/values
    option = if Array.isArray(model.value)
      @props.idIndices = for id in model.value
        id
      MultiMultipleChoiceOption(@props)
    else
      SimpleMultipleChoiceOption(@props)

    id = "#{questionId}-#{model.id}"

    inputType = 'hidden' if isAnswered

    classes = ['option']
    # null (unanswered), 'correct', 'incorrect', 'missed'
    classes.push(@props.answerState) if @props.answerState

    optionIdent = @props.model.id or @props.model.value
    if Array.isArray(@props.answer)
      isChecked = @props.answer.indexOf(optionIdent) >= 0
    else
      isChecked = @props.answer is optionIdent

    contents = [
      <span key='letter' className='letter'><AnswerLabeler after=')' index={index}/> </span>
      <span key='answer' className='answer'>{option}</span>
    ]


    unless isAnswered
      contents =
        <label>
          <input type={inputType}
            ref='input'
            name={questionId}
            value={JSON.stringify(model.value)}
            onChange=@onChange
            defaultChecked={isChecked}
          />
          {contents}
        </label>

    <li key={id} className={classes.join(' ')}>
      {contents}
    </li>



MultipleChoiceOption = React.createClass
  displayName: 'MultipleChoiceOption'
  getDefaultProps: -> {inputType:'radio'}
  mixins: [MultipleChoiceOptionMixin]

  onChange: ->
    @props.onChange(@props.model)


MultipleChoiceQuestion = React.createClass
  displayName: 'MultipleChoiceQuestion'

  render: ->
    {model} = @props
    isAnswered = !!model.answer

    questionId = model.id
    options = for option, index in model.answers
      answerState = null
      if model.answer is option.id # if my answer is this option
        if model.correct is model.answer
          answerState = 'correct'
        else
          answerState = 'incorrect'
      else if model.correct is option.id and model.answers.length > 2
        answerState = 'missed'

      optionProps = {
        model: option
        answer: AnswerStore.getAnswer(model)
        questionId
        index
        isAnswered
        answerState
        @onChange
      }
      MultipleChoiceOption(optionProps)

    classes = ['question']
    classes.push('answered') if isAnswered

    <div key={questionId} className={classes.join(' ')}>
      <ul className='options'>{options}</ul>
    </div>

  onChange: (answer) ->
    AnswerActions.setAnswer(@props.model, answer.id or answer.value)


QUESTION_TYPES =
  'multiple-choice'   : MultipleChoiceQuestion

getQuestionType = (format) ->
  QUESTION_TYPES[format] or throw new Error("Unsupported format type '#{format}'")



Exercise1 = React.createClass
  mixins: [StepMixin]

  getInitialState: ->
    freeResponse: @props.model.free_response

  isEnabled: ->
    !! (@props.model.free_response or @state.freeResponse)

  renderBody: ->
    {content} = @props.model
    # TODO: Assumes 1 question.
    question = content.questions[0]

    <div className="exercise">
      <ArbitraryHtmlAndMath className="stimulus" block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className="stem" block={true} html={question.stem_html} />
      <textarea
        className="form-control"
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

  onSaveAndContinue: ->
    {freeResponse} = @state
    AnswerActions.setFreeResponseAnswer(@props.model.content.questions[0], freeResponse)


Exercise2 = React.createClass
  mixins: [StepMixin]

  getInitialState: ->
    isEnabled: !! @props.model.answer

  renderBody: ->
    {content, free_response, correct_answer_id, feedback_html} = @props.model
    # TODO: Assumes 1 question.
    question = content.questions[0]
    answer_id = @props.model.answer_id or AnswerStore.getAnswer(question)?.id
    free_response ?= AnswerStore.getFreeResponseAnswer(question)

    Type = getQuestionType(question.format)

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      <div className="free-response">{free_response}</div>
      <div>Choose the best answer from the following:</div>
    </Question>

  onAnswerChanged: (answer) ->
    AnswerActions.setAnswer(@props.model.content.questions[0], answer)

  isEnabled: -> !! AnswerStore.getAnswer(@props.model.content.questions[0])

  onSaveAndContinue: ->
    # {freeResponse} = @state
    # AnswerActions.setFreeResponseAnswer(@props.model.content.questions[0], freeResponse)
    @props.onComplete()



module.exports = React.createClass
  displayName: 'Exercise'

  render: ->
    {content, free_response, answer, correct_answer, feedback} = @props.model
    # TODO: Assumes 1 question.
    question = content.questions[0]

    free_response ?= AnswerStore.getFreeResponseAnswer(question)

    # This should handle the 4 different states an Exercise can be in:
    # 1. `not(free_response)`: Show the question stem and a text area
    # 2. `free_response and not(answer_id)`: Show stem, your free_response, and the multiple choice options
    # 3. `correct_answer`: review how you did and show feedback (if any)
    # 4. `task.is_completed and answer` show your answer choice but no option to change it

    if correct_answer
      # 3. `correct_answer`: review how you did and show feedback (if any)
      <Exercise2 model={@props.model} onComplete={@props.onComplete} />
    else if free_response
      # 2. `free_response and not(answer_id)`: Show stem, your free_response, and the multiple choice options
      <Exercise2
        model={@props.model}
        onComplete={@props.onComplete}
      />
    else
      # 1. `not(free_response)`: Show the question stem and a text area
      <Exercise1
        model={@props.model}
        onComplete={@props.onComplete}
      />
