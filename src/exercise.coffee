config =
  short_answer: prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
   #multiple_choice: true

exercise = require('./test')
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
