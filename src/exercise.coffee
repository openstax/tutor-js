# @csx React.DOM
config =
  short_answer: prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
   #multiple_choice: true

React = require('react')
exercise = require('./test')
{Compiler, DOMHelper, hooks} = require('./htmlbars')



domify = (source, data) ->
  source = source.replace(/____(\d+)?/g, '<input type="text"/>')
  template     = Compiler.compile(source)
  dom          = template(data, {hooks: hooks, dom: new DOMHelper()})
  dom



Exercise = React.createClass
  render: ->
    <div className="exercise">
      <div className="background"></div>
      {ExercisePart(part) for part in @props.parts}
    </div>

  componentDidMount: ->
    stem = @getDOMNode().querySelector('.background')
    content = domify(@props.background, state)
    stem.appendChild(content)


makeQuestion = (question, type=null) ->
  unless type
    if /____(\d+)?/.test(question.stem)
      type = BlankQuestion
    else if question.answers.length > 1 and not config.short_answer
      # Multiple Choice
      type = MultipleChoiceQuestion
    else
      type = SimpleQuestion
  type(question)

ExercisePart = React.createClass
  render: ->
    # A Matching Part does not render each question
    if @props.background?.split('____').length > 2
      questions = []
    else
      questions = @props.questions

    <div className="part">
      <div className="background"></div>
      {makeQuestion(question) for question in questions}
    </div>

  componentDidMount: ->
    stem = @getDOMNode().querySelector('.background')
    background = @props.background
    if @props.background?.split('____').length > 2
      if config.short_answer
        background = @props.background
        keepBlankIndex = randRange(0, @props.questions.length - 1)
        for question, i in @props.questions
          if i isnt keepBlankIndex
            answer = question.answers[0].content or question.answers[0].value
            background = background.replace("____#{i + 1}", answer)

    content = domify(background, state)
    stem.appendChild(content)

BlankQuestion = React.createClass
  render: ->
    <div className="question">
      <div className="stem"></div>
      <input type="text" placeholder={@props.short_stem} />
    </div>
  componentDidMount: ->
    stem = @getDOMNode().querySelector('.stem')
    content = domify(@props.stem, state)
    stem.appendChild(content)


SimpleQuestion = React.createClass
  render: ->
    <div className="question">
      <div className="stem">{@props.stem}</div>
      <input type="text" placeholder={@props.short_stem} />
    </div>

MultipleChoiceOption = React.createClass
  render: ->
    value = domify(@props.answer.value, state).textContent
    <li className="option">
      <input type="radio" name={@props.questionId} id={@props.id} value={value}/>
      <label htmlFor={@props.id}></label>
    </li>
  componentDidMount: ->
    label = @getDOMNode().querySelector('label')
    content = domify(@props.answer.content or @props.answer.value, state)
    label.appendChild(content)

questionCounter = 0
MultipleChoiceQuestion = React.createClass
  render: ->
    questionId = "id-#{questionCounter++}"
    options = for answer, id in @props.answers
      id = "#{questionId}-#{id}"
      MultipleChoiceOption({answer, questionId, id})
    <div className="question">
      <div className="stem">{@props.stem}</div>
      <ul className="options">{options}</ul>
    </div>




randRange = (min, max) ->
  Math.floor(Math.random() * (max - min + 1)) + min

# Generate the variables
state = {}
for key, val of exercise.logic.inputs
  state[key] = randRange(val.start, val.end)

for key, val of exercise.logic.outputs
  val = val(state)
  try
    val = parseInt(val)
    # Inject commas
    val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  catch
    ''
  state[key] = val

# -------------------------------
# Generate the HTML




root = document.body
root.innerHTML = ''
React.renderComponent(Exercise(exercise), root)
