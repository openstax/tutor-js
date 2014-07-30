config =
  short_answer: prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
   #multiple_choice: true

exercise =
  logic:
    inputs:
      scale: { start: 1, end: 3 }
      mass:  { start: 1, end: 3 }
      speed: { start: 1, end: 3 }
    outputs:
      ship_mass: ({scale, mass, speed}) -> scale * Math.pow(100, mass)
      ship_speed: ({scale, mass, speed}) -> scale * Math.pow(10, speed)
      ship_force: ({scale, mass, speed}) -> scale * Math.pow(100, mass) * scale * Math.pow(10, speed)
      ship_mass_grams: ({scale, mass, speed}) -> scale * Math.pow(100, mass) * 1000
      ship_mass_div_speed: ({scale, mass, speed}) -> scale * Math.pow(100, mass) / scale * Math.pow(10, speed)

  background: 'This exercise has many parts. Each one is a different type of question. Einstein makes a {{ ship_mass }} kg spaceship'
  parts: [
    {
      background: 'The spaceship moves at {{ ship_speed }} m/s'
      questions: [
        {
          stem: 'What is the rest mass? (Short answer)'
          short_stem: 'Enter your answer in kg'
          answers: [
            { credit: 1, value: '{{ ship_mass }}' }
          ]
        }
        {
          stem: 'What is the rest mass?'
          short_stem: 'Enter your answer in kg'
          answers: [
            { credit: 1, value: '{{ ship_mass }}' }
            { credit: 0, value: '{{ ship_mass_grams }}', hint: 'Check the units' }
          ]
        }
        {
          stem: 'What is the force if it slams into a wall?'
          short_stem: 'Enter your answer in N'
          answers: [
            { credit: 1, value: '{{ ship_force }}',          content: '{{ ship_force }} N' }
            { credit: 0, value: '{{ ship_mass_div_speed }}', content: '{{ ship_mass_div_speed }} N', hint: 'Remember 1 Newton (N) is 1 kg*m/s' }
          ]
        }
      ]
    }
    # Fill in the blanks
    {
      background: 'Simple fill-in-the-blank questions'
      questions: [
        { stem: 'Photosynthesis ____ ATP', answers: [{ credit: 1, value: 'creates' }] }
      ]
    }
    {
      background: '''Fill in this table (this is a multi-fill-in-the-blank):

        <table>
          <tr><th>Time</th><th>Distance</th><th>Velocity</th></tr>
          <tr><td>t<sub>0</sub></td><td>____1</td><td>____2</td></tr>
          <tr><td>t<sub>1</sub></td><td>____3</td><td>____4</td></tr>
          <tr><td>t<sub>2</sub></td><td>____5</td><td>____6</td></tr>
        </table>
      '''
      questions: [
        { answers: [{ credit: 1, value: 0 }] }
        { answers: [{ credit: 1, value: -1, content: '{{ ship_mass }}' }] }
        { answers: [{ credit: 1, value: '{{ ship_force }}' }] }
        { answers: [{ credit: 1, value: 10, content: '{{ ship_speed }}' }] }
        { answers: [{ credit: 1, value: 100, content: '{{ ship_force }}' }] }
        { answers: [{ credit: 1, value: 1000, content: '{{ ship_mass_grams }}' }] }
      ]
    }
  ]

{Compiler, DOMHelper, hooks} = require('./htmlbars')


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



domify = (source, data) ->
  template     = Compiler.compile(source)
  dom          = template(data, {hooks: hooks, dom: new DOMHelper()})
  dom

# -------------------------------
# Generate the HTML

# Unescape a string with handlebars `{{ ... }}` templates
makeDiv = (name, text, children=[]) ->
  text = text.replace(/____(\d+)?/g, '<input type="text"/>')
  "<div class='#{name}'>#{text}#{children.join('')}</div>"

makeInput = (name, text) ->
  text = text.replace(/____(\d+)?/g, '<input type="text"/>')
  "<input type='text' class='#{name}' placeholder=\"#{text}\"/>"

nextId = 0
makeRadioDiv = (questionId, name, value, text) ->
  id = "id-#{nextId++}"
  text = text.replace(/____(\d+)?/g, '<input type="text"/>')
  "<div class='#{name}'><input type='radio' name='#{questionId}' id='#{id}' value='#{value}'/> <label for='#{id}'>#{text}</label></div>"



parts = for part, partIndex in exercise.parts
  if part.background and part.background.split('____').length > 2 and config.short_answer
    background = part.background
    keepBlankIndex = randRange(0, part.questions.length - 1)
    for question, i in part.questions
      if i isnt keepBlankIndex
        answer = question.answers[0].content or question.answers[0].value
        # answer = makeDiv('answer', answer)
        background = background.replace("____#{i + 1}", answer)

    makeDiv('part', background)

  else
    questions = for question, questionIndex in part.questions
      if /____(\d+)?/.test(question.stem)
        makeDiv('question', question.stem)

      else if question.answers.length > 1 and not config.short_answer
        # Multiple Choice
        choices = for answer in question.answers
          if answer.content
            makeRadioDiv("id-#{partIndex}-#{questionIndex}", 'choice', answer.value, answer.content)
          else
            makeRadioDiv("id-#{partIndex}-#{questionIndex}", 'choice', answer.value, answer.value)
        makeDiv('question', question.stem, choices)
      else
        if question.short_stem
          a = makeDiv('question', question.stem)
          b = makeInput('question', question.short_stem)
          "#{a}#{b}"
        else if question.stem
          a = makeDiv('question', question.stem)
          b = makeInput('question', '')
          "#{a}#{b}"
        else
          ''

    makeDiv('part', part.background, questions)


$ex = document.getElementById('exercise')
$ex.innerHTML = ''
$ex.appendChild(domify makeDiv('background', exercise.background, parts), state)
