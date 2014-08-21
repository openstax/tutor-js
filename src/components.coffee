# @csx React.DOM

# prefer_short_answer = prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
prefer_short_answer = false

React = require 'react'
AnswerStore = require './answer-store'

# Converts an index to `a-z` for question answers
AnswerLabeler = React.createClass
  displayName: 'AnswerLabeler'
  render: ->
    {index, before, after} = @props
    letter = String.fromCharCode(index + 97) # For uppercase use 65
    <span className="answer-char">{before}{letter}{after}</span>


Exercise = React.createClass
  displayName: 'Exercise'
  render: ->
    {config} = @props
    <div className="exercise">
      <div className="background" dangerouslySetInnerHTML={__html:config.background}></div>
      {ExercisePart {config:part} for part in config.parts}
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

variantCounter = 0
QuestionVariants = React.createClass
  displayName: 'QuestionVariants'
  render: ->
    {config} = @props

    idPrefix = "id-variants-#{variantCounter++}" # HACK

    formatCheckboxes = for format, i in config.formats
      <input type="checkbox" data-format={format} id={"#{idPrefix}-#{format}"}/>
    formatLabels = for format, i in config.formats
      <label data-format={format} htmlFor={"#{idPrefix}-#{format}"}>{format}</label>

    variants = []
    for format in config.formats
      type = getQuestionType(format)
      if type
        props =
          config: config.variants[format]
        variants.push(<div className="variant" data-format={format}>{type(props)}</div>)

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
  displayName: 'ExercisePart'
  render: ->
    {config} = @props

    questions = config.questions

    <div className="part">
      <div className="background" dangerouslySetInnerHTML={__html:config.background}></div>
      {QuestionVariants {config:question} for question in questions}
    </div>

BlankQuestion = React.createClass
  displayName: 'BlankQuestion'
  render: ->
    {config} = @props
    <div className="question">
      <div className="stem" dangerouslySetInnerHTML={__html:config.stem}></div>
    </div>

  componentDidMount: ->
    # Find the input box and attach listeners to it
    input = @getDOMNode().querySelector('input')
    input.onkeyup = input.onblur = =>
      AnswerStore.answerQuestion(@props.config.id, input.value) if input.value


SimpleQuestion = React.createClass
  displayName: 'SimpleQuestion'
  render: ->
    {config} = @props
    <div className="question">
      <div className="stem">{config.stem}</div>
      <input type="text" placeholder={config.short_stem} ref="prompt" onChange=@onChange />
    </div>

  onChange: ->
    val = @refs.prompt.getDOMNode().value
    if val
      AnswerStore.answerQuestion(@props.config.id, val)
    else
      AnswerStore.answerQuestion(@props.config.id, undefined)


SimpleMultipleChoiceOption = React.createClass
  displayName: 'SimpleMultipleChoiceOption'
  render: ->
    {config, questionId, index} = @props
    id = config.id

    <span className="templated-todo" dangerouslySetInnerHTML={__html:config.content or config.value}>
    </span>

MultiMultipleChoiceOption = React.createClass
  displayName: 'MultiMultipleChoiceOption'
  render: ->
    {config, idIndices} = @props
    vals = []
    for id, i in idIndices
      unless config.value.indexOf(id) < 0
        index = config.value.indexOf(id)
        vals.push <AnswerLabeler key={index} before="(" after=")" index={index}/>
    <span className="multi">{vals}</span>

MultipleChoiceOption = React.createClass
  displayName: 'MultipleChoiceOption'
  render: ->
    {config, questionId, index} = @props

    option = if Array.isArray(config.value)
      @props.idIndices = for id in config.value
        id
      MultiMultipleChoiceOption(@props)
    else
      SimpleMultipleChoiceOption(@props)

    id = "#{questionId}-#{config.id}"
    <li key={id} className="option">
      <input type="radio"
        name={questionId}
        id={id}
        value={JSON.stringify(config.value)}
        onChange=@onChange
      />
      <label htmlFor={id}><AnswerLabeler after=")" index={index}/> </label>
      <label htmlFor={id}>{option}</label>
    </li>

  onChange: ->
    AnswerStore.answerQuestion(@props.questionId, @props.config.id or @props.config.value)


MultipleChoiceQuestion = React.createClass
  displayName: 'MultipleChoiceQuestion'
  render: ->
    {config} = @props
    questionId = config.id
    options = for answer, index in config.answers
      MultipleChoiceOption({config:answer, questionId, index})

    <div key={questionId} className="question">
      <div className="stem" dangerouslySetInnerHTML={__html:config.stem}></div>
      <ul className="options">{options}</ul>
    </div>



MultiSelectOption = React.createClass
  displayName: 'MultiSelectOption'
  render: ->
    {config, questionId, index} = @props
    option = SimpleMultipleChoiceOption(@props)
    id = "#{questionId}-#{config.id}"

    <li key={id} className="option">
      <input type="checkbox"
        name={questionId}
        id={id}
        value={config.value}
        onChange=@onChange
      />
      <label htmlFor={id}><AnswerLabeler after=")" index={index}/> </label>
      <label htmlFor={id}>{option}</label>
    </li>

  onChange: ->
    @state = !@state
    @props.onChange(@props.config, @state)


MultiSelectQuestion = React.createClass
  displayName: 'MultiSelectQuestion'
  render: ->
    {config} = @props
    questionId = config.id

    options = []

    for answer, index in config.answers
      unless Array.isArray(answer.value)
        options.push MultiSelectOption({config:answer, questionId, index, @onChange})

    <div key={questionId} className="question">
      <div className="stem" dangerouslySetInnerHTML={__html:config.stem}></div>
      <div>Select all that apply:</div>
      <ul className="options">{options}</ul>
    </div>

  onChange: (answer, isChecked) ->
    @state ?= []
    if isChecked
      @state.push(answer.id) if @state.indexOf(answer.id) < 0
    else
      i = @state.indexOf(answer.id)
      @state.splice(i, 1) if i >= 0

    if @state.length
      AnswerStore.answerQuestion(@props.config.id, @state)
    else
      AnswerStore.answerQuestion(@props.config.id, undefined)


TrueFalseQuestion = React.createClass
  displayName: 'TrueFalseQuestion'
  render: ->
    {config} = @props
    questionId = config.id
    idTrue = "#{questionId}-true"
    idFalse = "#{questionId}-false"

    <div className="question true-false">
      <div className="stem" dangerouslySetInnerHTML={__html:config.stem}></div>
      <ul className="options">
        <li className="option">
          <input type="radio" name={questionId} id={idTrue} value="true" onChange=@onTrue />
          <label htmlFor={idTrue}>True</label>
        </li>
        <li className="option">
          <input type="radio" name={questionId} id={idFalse} value="true" onChange=@onFalse />
          <label htmlFor={idFalse}>False</label>
        </li>
      </ul>
    </div>

  onTrue:  -> AnswerStore.answerQuestion(@props.config.id, true)
  onFalse: -> AnswerStore.answerQuestion(@props.config.id, false)


MatchingQuestion = React.createClass
  displayName: 'MatchingQuestion'
  render: ->
    {config} = @props
    rows = for answer, i in config.answers
      item = config.items[i]

      <tr key={answer.id}>
        <td className="item" dangerouslySetInnerHTML={__html:item}></td>
        <td className="spacer"></td>
        <td className="answer" dangerouslySetInnerHTML={__html:answer.content or answer.value}></td>
      </tr>

    <div className="question matching">
      <table>
        <caption className="stem" dangerouslySetInnerHTML={__html:config.stem}></caption>
        {rows}
      </table>
    </div>



module.exports = {Exercise, getQuestionType}
