# @csx React.DOM

# prefer_short_answer = prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
prefer_short_answer = false

React = require('react')
{Compiler, DOMHelper, hooks} = require('./htmlbars')



domify = (source, data, leaveBlanks) ->
  unless leaveBlanks
    source = source.replace(/____(\d+)?/g, '<input type="text"/>')
  template     = Compiler.compile(source)
  dom          = template(data, {hooks: hooks, dom: new DOMHelper()})
  dom



Exercise = React.createClass
  render: ->
    {config, state} = @props
    <div className="exercise">
      <div className="background"></div>
      {ExercisePart {state, config:part} for part in config.parts}
    </div>

  componentDidMount: ->
    {config, state} = @props
    stem = @getDOMNode().querySelector('.background')
    content = domify(config.background, state)
    stem.appendChild(content)


getQuestionType = (format) ->
  switch format
    when 'matching' then MatchingQuestion
    when 'multiple-choice' then MultipleChoiceQuestion
    when 'multiple-select' then null
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

QuestionVariants = React.createClass
  render: ->
    {config, state} = @props

    formatCheckboxes = []
    for format, i in config.formats
      formatCheckboxes.push(<input type="checkbox" data-format={format}/>)
      formatCheckboxes.push(format)

    variants = []
    for format in config.formats
      type = getQuestionType(format)
      if type
        variants.push(<div class="variant" data-format={format}>{type(@props)}</div>)

    if variants.length is 1
      return variants[0]
    else
      <div className="variants">
        This question has variants. Click to Show
        {formatCheckboxes}
        {variants}
      </div>

ExercisePart = React.createClass
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

    content = domify(background, state)
    stem.appendChild(content)

BlankQuestion = React.createClass
  render: ->
    {config} = @props
    <div className="question">
      <div className="stem"></div>
    </div>

  componentDidMount: ->
    {config} = @props
    state = @props.state
    stem = @getDOMNode().querySelector('.stem')
    content = domify(config.stem, state)
    stem.appendChild(content)


SimpleQuestion = React.createClass
  render: ->
    {config} = @props
    <div className="question">
      <div className="stem">{config.stem}</div>
      <input type="text" placeholder={config.short_stem} />
    </div>

MultipleChoiceOption = React.createClass
  render: ->
    {state, answer, questionId, id} = @props
    value = domify(answer.value, state).textContent
    <li className="option">
      <input type="radio" name={questionId} id={id} value={value}/>
      <label htmlFor={id}></label>
    </li>
  componentDidMount: ->
    {answer, state} = @props
    label = @getDOMNode().querySelector('label')
    content = domify(answer.content or answer.value, state)
    label.appendChild(content)

questionCounter = 0
MultipleChoiceQuestion = React.createClass
  render: ->
    {config, state} = @props
    questionId = "id-#{questionCounter++}"
    options = for answer, id in config.answers
      id = "#{questionId}-#{id}"
      MultipleChoiceOption({state, answer, questionId, id})

    <div className="question">
      <div className="stem"></div>
      <ul className="options">{options}</ul>
    </div>

  componentDidMount: ->
    {config, state} = @props
    stem = @getDOMNode().querySelector('.stem')
    content = domify(config.stem, state, true) # true = leaveBlanks
    stem.appendChild(content)


TrueFalseQuestion = React.createClass
  render: ->
    {config, state} = @props
    questionId = "id-#{questionCounter++}"
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

  componentDidMount: ->
    {config, state} = @props
    stem = @getDOMNode().querySelector('.stem')
    # If there is a blank in the stem then replace it with one of the answers
    text = config.stem
    if /____/.test(text)
      text = text.replace(/____(\d+)?/, config.answers[0].value)
    content = domify(text, state)
    stem.appendChild(content)

MatchingQuestion = React.createClass
  render: ->
    {config} = @props
    rows = for answer in config.answers
      <tr>
        <td className="item"></td>
        <td className="answer"></td>
      </tr>

    <table className="question matching">
      <caption className="stem"></caption>
      {rows}
    </table>

  componentDidMount: ->
    {config, state} = @props

    stem = @getDOMNode().querySelector('caption.stem')
    domItems = @getDOMNode().querySelectorAll('td.item')
    domAnswers = @getDOMNode().querySelectorAll('td.answer')

    stem.appendChild(domify(config.stem, state))

    for item, i in config.items
      content = domify(item, state)
      domItems[i].appendChild(content)

    for answer, i in config.answers
      content = domify(answer.content or answer.value, state)
      domAnswers[i].appendChild(content)


module.exports = {Exercise}
