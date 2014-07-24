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
    # Matching Part
    {
      background: '''Fill in this table:

        <table>
          <tr><th>Time</th><th>Distance</th><th>Velocity</th></tr>
          <tr><td>t<sub>0</sub></td><td>__1__</td><td>__2__</td></tr>
          <tr><td>t<sub>1</sub></td><td>__3__</td><td>__4__</td></tr>
          <tr><td>t<sub>2</sub></td><td>__5__</td><td>__6__</td></tr>
        </table>
      '''
      questions: [
        { answers: [{ credit: 1, value: 0 }] }
        { answers: [{ credit: 1, value: 1 }] }
        { answers: [{ credit: 1, value: 0 }] }
        { answers: [{ credit: 1, value: 10 }] }
        { answers: [{ credit: 1, value: 10 }] }
        { answers: [{ credit: 1, value: 100 }] }
      ]
    }
  ]


# Generate the variables
state = {}
for key, val of exercise.logic.inputs
  min = val.start
  max = val.end
  state[key] = Math.floor(Math.random() * (max - min + 1)) + min

for key, val of exercise.logic.outputs
  val = val(state)
  try
    val = parseInt(val)
    # Inject commas
    val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  catch
    ''
  state[key] = val


console.log(state)


# -------------------------------
# Generate the HTML

# Unescape a string with handlebars `{{ ... }}` templates
makeDiv = (name, text, children=[]) ->
  text = text.replace(/__(\d+)?__/g, '<input type="text"/>')
  "<div class='#{name}'>#{Handlebars.compile(text)(state)}#{children.join('')}</div>"

makeInput = (name, text) ->
  text = text.replace(/__(\d+)?__/g, '<input type="text"/>')
  "<input type='text' class='#{name}' placeholder=\"#{Handlebars.compile(text)(state)}\"/>"

makeRadioDiv = (name, text) ->
  text = text.replace(/__(\d+)?__/g, '<input type="text"/>')
  "<div class='#{name}'><input type='radio'/> #{Handlebars.compile(text)(state)}</div>"


parts = for part in exercise.parts
  questions = for question in part.questions
    if /__(\d+)?__/.test(question.stem)
      # Fill in the blank
      makeDiv('stem', question.stem)
    else if question.answers.length > 1 and not config.short_answer
      # Multiple Choice
      choices = for answer in question.answers
        if answer.content
          makeRadioDiv('choice', answer.content)
        else
          makeRadioDiv('choice', answer.value)
      makeDiv('question', question.stem, choices)
    else
      if question.short_stem
        a = makeDiv('stem', question.stem)
        b = makeInput('stem', question.short_stem)
        "#{a}#{b}"
      else if question.stem
        a = makeDiv('stem', question.stem)
        b = makeInput('stem', '')
        "#{a}#{b}"
      else
        ''

  makeDiv('part', part.background, questions)


document.getElementById('exercise').innerHTML = makeDiv('background', exercise.background, parts)
