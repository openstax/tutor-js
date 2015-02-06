_ = require 'underscore'
React = require 'react'
katex = require 'katex'
{AnswerActions, AnswerStore} = require '../flux/answer'
ArbitraryHtmlAndMath = require './html'

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


BlankQuestion = React.createClass
  displayName: 'BlankQuestion'
  mixins: [QuestionMixin]
  renderStem: ->
    {model} = @props
    {stem} = model
    isAnswered = !!model.answer

    if isAnswered
      # TODO: Make sure HTML is escaped!!!
      if model.answer is model.correct
        stem = stem.replace(/____/, "<span class='correct'>#{model.answer}</span>")
      else
        stem = stem.replace(/____/, "<span class='incorrect'>#{model.answer}</span><span class='missed'>#{model.correct}</span>")
    else
      stem = stem.replace(/____/, '<input type="text" placeholder="fill this in" class="blank"/>')

    <ArbitraryHtmlAndMath block=true className='stem' html={stem} />

  componentDidMount: ->
    # Find the input box and attach listeners to it
    input = @getDOMNode().querySelector('.blank')
    input?.onkeyup = input?.onblur = input?.onchange = =>
      if input.value
        AnswerActions.setAnswer(@props.model, input.value)
      else
        AnswerActions.setAnswer(@props.model, undefined)


SimpleQuestion = React.createClass
  displayName: 'SimpleQuestion'
  mixins: [QuestionMixin]
  renderBody: ->
    {model} = @props
    isAnswered = !!model.answer
    answer = AnswerStore.getAnswer(model)

    if isAnswered
      <div className='answer'>Your answer: <strong>{answer}</strong></div>
    else
      <textarea
          className='form-control'
          rows='2'
          ref='prompt'
          placeholder={model.short_stem}
          value={answer or ''}
          onChange=@onChange />

  onChange: ->
    val = @refs.prompt.getDOMNode().value
    if val
      AnswerActions.setAnswer(@props.model, val)
    else
      AnswerActions.setAnswer(@props.model, undefined)


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
      <ArbitraryHtmlAndMath block=true className='stem' html={model.stem} />
      <ul className='options'>{options}</ul>
    </div>

  onChange: (answer) ->
    AnswerActions.setAnswer(@props.model, answer.id or answer.value)


MultiSelectOption = React.createClass
  displayName: 'MultiSelectOption'
  getDefaultProps: -> {inputType:'checkbox'}
  mixins: [MultipleChoiceOptionMixin]

  onChange: ->
    # NOTE: @refs.input.state.checked only works for checkboxes (not radio buttons)
    # but @refs.input.getDOMNode().checked works for both
    # and @refs.input.getDOMNode().checked does not work for Node tests ; (
    @props.onChange(@props.model)


# http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
ArrayEquals = (ary1, array) ->
  # if the other array is a falsy value, return
  return false  unless array
  # compare lengths - can save a lot of time
  return false  unless ary1.length is array.length
  i = 0
  l = ary1.length
  while i < l
    # Check if we have nested arrays
    if ary1[i] instanceof Array and array[i] instanceof Array
      # recurse into the nested arrays
      return false  unless ary1[i].equals(array[i])
    # Warning - two different object instances will never be equal: {x:20} != {x:20}
    else return false  unless ary1[i] is array[i]
    i++
  true

MultiSelectQuestion = React.createClass
  displayName: 'MultiSelectQuestion'
  mixins: [QuestionMixin]
  getInitialState: ->
    answers: []

  renderBody: ->
    {model} = @props
    isAnswered = !!model.answer
    questionId = model.id

    options = []

    for option, index in model.answers
      unless Array.isArray(option.value)
        isCorrect = false
        isIncorrect = false

        if isAnswered and model.correct
          correctAnswers = _.find(model.answers, (a) -> a.id is model.correct).value
          # If correctAnswers is not an array then there is only 1 correct answer
          unless Array.isArray(correctAnswers)
            correctAnswers = [model.correct]

          if model.answer?.indexOf(option.id) >= 0 # if my answer contains this option
            if correctAnswers.indexOf(option.id) >= 0
              answerState = 'correct'
            else
              answerState = 'incorrect'
          else if correctAnswers.indexOf(option.id) >= 0 # This option was missed
            answerState = 'missed'
          else
            answerState = null

        optionProps = {
          model: option
          answer: AnswerStore.getAnswer(model)
          isAnswered
          answerState
          questionId
          index
          @onChange
        }

        options.push MultiSelectOption(optionProps)

    <div key={questionId} className='question-body'>
      <div>Select all that apply:</div>
      <ul className='options'>{options}</ul>
    </div>

  onChange: (answer, isChecked) ->
    i = @state.answers.indexOf(answer.id)
    if i >= 0
      @state.answers.splice(i, 1)
    else
      @state.answers.push(answer.id)

    if @state.answers.length
      AnswerActions.setAnswer(@props.model, @state.answers)
    else
      AnswerActions.setAnswer(@props.model, undefined)


TrueFalseQuestion = React.createClass
  displayName: 'TrueFalseQuestion'
  mixins: [QuestionMixin]

  renderBody: ->
    {model} = @props
    isAnswered = model.answer?
    questionId = model.id
    idTrue = "#{questionId}-true"
    idFalse = "#{questionId}-false"

    if isAnswered
      trueClasses  = ['option']
      falseClasses = ['option']

      if model.correct
        correctClasses = trueClasses
        incorrectClasses = falseClasses
      else
        correctClasses = falseClasses
        incorrectClasses = trueClasses
      if model.correct is !! model.answer
        correctClasses.push('correct')
      else
        # correctClasses.push('missed') No need to show missed if there are only 2 options
        incorrectClasses.push('incorrect')

      <div className='question-body'>
        <ul className='options'>
          <li className={trueClasses.join(' ')}>
            <span>True</span>
          </li>
          <li className={falseClasses.join(' ')}>
            <span>False</span>
          </li>
        </ul>
      </div>


    else
      <div className='question-body'>
        <ul className='options'>
          <li className='option'>
            <label>
              <input type='radio' name={questionId} value='true' onChange=@onTrue />
              <span>True</span>
            </label>
          </li>
          <li className='option'>
            <label>
              <input type='radio' name={questionId} value='false' onChange=@onFalse />
              <span>False</span>
            </label>
          </li>
        </ul>
      </div>

  onTrue:  -> AnswerActions.setAnswer(@props.model, true)
  onFalse: -> AnswerActions.setAnswer(@props.model, false)


MatchingQuestion = React.createClass
  displayName: 'MatchingQuestion'
  mixins: [QuestionMixin]

  renderBody: ->
    {model} = @props
    rows = for answer, i in model.answers
      item = model.items[i]

      <tr key={answer.id}>
        <td className='item'>
          <ArbitraryHtmlAndMath className='stem' html={item} />
        </td>
        <td className='spacer'></td>
        <td className='answer'>
          <ArbitraryHtmlAndMath className='stem' html={answer.content or answer.value} />
        </td>
      </tr>

    <table>
      {rows}
    </table>


QUESTION_TYPES =
  'matching'          : MatchingQuestion
  'multiple-choice'   : MultipleChoiceQuestion
  'multiple-select'   : MultiSelectQuestion
  'short-answer'      : SimpleQuestion
  'true-false'        : TrueFalseQuestion
  'fill-in-the-blank' : BlankQuestion

getQuestionType = (format) ->
  QUESTION_TYPES[format] or throw new Error("Unsupported format type '#{format}'")


Exercise = React.createClass
  displayName: 'Exercise'
  render: ->
    {model} = @props

    questions = for questionConfig in model.content.questions
      format = questionConfig.format
      Type = getQuestionType(format)
      props = {model:questionConfig}
      Type(props)

    <div className='exercise'>
      <ArbitraryHtmlAndMath className='stimulus' html={model.content.stimulus} />
      {questions}
    </div>


module.exports = {Exercise, getQuestionType}
