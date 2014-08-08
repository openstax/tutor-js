# @csx React.DOM

# prefer_short_answer = prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
prefer_short_answer = false

React = require 'react'
HTMLBarsMixin = require './htmlbars-mixin'

# Converts an index to `a-z` for question answers
AnswerLabeler = React.createClass
  render: ->
    {index, before, after} = @props
    letter = String.fromCharCode(index + 97) # For uppercase use 65
    <span className="answer-char">{before}{letter}{after}</span>


Exercise = React.createClass
  mixins: [HTMLBarsMixin]
  htmlSelectors:
    '.background': (config) -> config.background

  render: ->
    {config, state} = @props
    <div className="exercise">
      <div className="background"></div>
      {ExercisePart {state, config:part} for part in config.parts}
    </div>


getQuestionType = (format) ->
  switch format
    when 'matching' then MatchingQuestion
    when 'multiple-choice' then MultipleChoiceQuestion
    when 'multiple-select' then MultiSelectQuestion
    when 'short-answer' then SimpleQuestion
    when 'true-false' then TrueFalseQuestion
    when 'fill-in-the-blank' then BlankQuestion
    else throw new Error("Unsupported format type '#{format}'")

  # if Array.isArray(question.items)
  #   type = MatchingQuestion
  # else if /____(\d+)?/.test(question.stem)
  #   type = BlankQuestion
  # else if question.answers.length > 1 and not prefer_short_answer
  #   # Multiple Choice
  #   type = MultipleChoiceQuestion
  # else
  #   type = SimpleQuestion

variantCounter = 0
QuestionVariants = React.createClass
  render: ->
    {config, state} = @props

    idPrefix = "id-variants-#{variantCounter++}" # HACK

    formatCheckboxes = for format, i in config.formats
      <input type="checkbox" data-format={format} id={"#{idPrefix}-#{format}"}/>
    formatLabels = for format, i in config.formats
      <label data-format={format} htmlFor={"#{idPrefix}-#{format}"}>{format}</label>

    variants = []
    for format in config.formats
      type = getQuestionType(format)
      if type
        variants.push(<div className="variant" data-format={format}>{type(@props)}</div>)

    if variants.length is 1
      return variants[0]
    else
      <div className="variants">
        {formatCheckboxes}
        <div className="options">
          The question below can be shown in several ways. Click to Show
          {formatLabels}
        </div>

        {variants}
      </div>

  componentDidMount: ->
    # Display the first variant (if there are multiple)
    @getDOMNode().querySelector('input[type="checkbox"], input[type="radio"]')?.checked = true

ExercisePart = React.createClass
  mixins: [HTMLBarsMixin]
  render: ->
    {config, state} = @props
    # A Matching Part does not render each question
    if config.background?.split('____').length > 2
      questions = []
    else
      questions = config.questions

    <div className="part">
      <div className="background"></div>
      {QuestionVariants {state, config:question} for question in questions}
    </div>

  componentDidMount: ->
    {config, state} = @props
    stem = @getDOMNode().querySelector('.background')
    background = config.background
    if config.background?.split('____').length > 2
      if prefer_short_answer
        background = config.background
        keepBlankIndex = randRange(0, config.questions.length - 1)
        for question, i in config.questions
          if i isnt keepBlankIndex
            answer = question.answers[0].content or question.answers[0].value
            background = background.replace("____#{i + 1}", answer)

    content = @domify(background, state)
    stem.appendChild(content)

BlankQuestion = React.createClass
  mixins: [HTMLBarsMixin]
  htmlSelectors:
    '.stem': (config) -> config.stem

  render: ->
    {config} = @props
    <div className="question">
      <div className="stem"></div>
    </div>

SimpleQuestion = React.createClass
  render: ->
    {config} = @props
    <div className="question">
      <div className="stem">{config.stem}</div>
      <input type="text" placeholder={config.short_stem} />
    </div>



SimpleMultipleChoiceOption = React.createClass
  mixins: [HTMLBarsMixin]
  htmlSelectors:
    '.templated-todo': (config) -> config.content or config.value

  render: ->
    {config, state, questionId, index} = @props
    id = config.id
    value = @domify(config.value, state).textContent
    <span>
      <span className="templated-todo"></span>
    </span>

MultiMultipleChoiceOption = React.createClass
  render: ->
    {config, idIndices} = @props
    vals = []
    for id, i in idIndices
      unless config.value.indexOf(id) < 0
        index = config.value.indexOf(id)
        vals.push <AnswerLabeler key={index} before="(" after=")" index={index}/>
    <span className="multi">{vals}</span>

MultipleChoiceOption = React.createClass
  render: ->
    {config, state, questionId, index} = @props

    option = if Array.isArray(config.value)
      @props.idIndices = for id in config.value
        id
      MultiMultipleChoiceOption(@props)
    else
      SimpleMultipleChoiceOption(@props)

    id = "#{questionId}-#{config.id}"
    <li key={id} className="option">
      <input type="radio" name={questionId} id={id} value={JSON.stringify(config.value)}/>
      <label htmlFor={id}><AnswerLabeler after=")" index={index}/> </label>
      <label htmlFor={id}>{option}</label>
    </li>



questionCounter = 0
MultipleChoiceQuestion = React.createClass
  mixins: [HTMLBarsMixin]
  htmlSelectors:
    '.stem': (config) -> config.stem

  htmlLeaveBlanks:
    '.stem': true

  render: ->
    {config, state} = @props
    questionId = config.id or "id-#{questionCounter++}"
    options = for answer, index in config.answers
      answer.id ?= "#{questionId}-#{index}"
      MultipleChoiceOption({state, config:answer, questionId, index})

    <div key={questionId} className="question">
      <div className="stem"></div>
      <ul className="options">{options}</ul>
    </div>



MultiSelectOption = React.createClass
  render: ->
    {config, state, questionId, index} = @props
    option = SimpleMultipleChoiceOption(@props)
    id = "#{questionId}-#{config.id}"

    <li key={id} className="option">
      <input type="checkbox" name={questionId} id={id} value={config.value}/>
      <label htmlFor={id}><AnswerLabeler after=")" index={index}/> </label>
      <label htmlFor={id}>{option}</label>
    </li>


MultiSelectQuestion = React.createClass
  mixins: [HTMLBarsMixin]
  htmlSelectors:
    '.stem': (config) -> config.stem

  htmlLeaveBlanks:
    '.stem': true

  render: ->
    {config, state} = @props
    questionId = config.id or "id-#{questionCounter++}"

    options = []

    for answer, index in config.answers
      unless Array.isArray(answer.value)
        options.push MultiSelectOption({state, config:answer, questionId, index})

    <div key={questionId} className="question">
      <div className="stem"></div>
      <div>Check all that apply:</div>
      <ul className="options">{options}</ul>
    </div>



TrueFalseQuestion = React.createClass
  mixins: [HTMLBarsMixin]
  htmlSelectors:
    '.stem': (config) ->
      # If there is a blank in the stem then replace it with one of the answers
      text = config.stem
      if /____/.test(text)
        text = text.replace(/____(\d+)?/, config.answers[0].value)
      text

  render: ->
    {config, state} = @props
    questionId = config.id or "id-#{questionCounter++}"
    idTrue = "#{questionId}-true"
    idFalse = "#{questionId}-false"

    <div className="question true-false">
      <div className="stem"></div>
      <ul className="options">
        <li className="option">
          <input type="radio" name={questionId} id={idTrue} value="true"/>
          <label htmlFor={idTrue}>True</label>
        </li>
        <li className="option">
          <input type="radio" name={questionId} id={idFalse} value="true"/>
          <label htmlFor={idFalse}>False</label>
        </li>
      </ul>
    </div>


MatchingQuestion = React.createClass
  mixins: [HTMLBarsMixin]
  htmlSelectors:
    'caption.stem': (config) -> config.stem

  render: ->
    {config} = @props
    rows = for answer in config.answers
      <tr key={answer.id}>
        <td className="item"></td>
        <td className="answer"></td>
      </tr>

    <table className="question matching">
      <caption className="stem"></caption>
      {rows}
    </table>

  componentDidMount: ->
    {config, state} = @props

    domItems = @getDOMNode().querySelectorAll('td.item')
    domAnswers = @getDOMNode().querySelectorAll('td.answer')

    for item, i in config.items
      content = @domify(item, state)
      domItems[i].appendChild(content)

    for answer, i in config.answers
      content = @domify(answer.content or answer.value, state)
      domAnswers[i].appendChild(content)


module.exports = {Exercise, getQuestionType}
