React = require 'react'
{AnswerActions, AnswerStore} = require './stores/answer'
{ExerciseActions, ExerciseStore, EXERCISE_MODES} = require './stores/exercise'
Exercise = require './components/exercise'
ajax = require './ajax'


# Just for debugging
window.React = React
window.ExerciseComponent = React.createFactory(Exercise)
window.ExerciseActions = ExerciseActions
window.ExerciseStore = ExerciseStore
window.EXERCISE_MODES = EXERCISE_MODES
window.logout = -> ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)

# Determine the URL to use based on the browser location
if /\/exercises\/\d+/.test(window.location.pathname)
  url = "/api#{window.location.pathname}"

  # Determine if the user is logged in first
  ajax {type:'GET', url: '/api/user'}, (err, xhr) ->

    isLoggedIn = not err
    if isLoggedIn
      ExerciseActions.changeExerciseMode(EXERCISE_MODES.EDIT)
    else
      ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)

    # ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)

    # fetch the exercise JSON
    options =
      url: url
      type: 'GET'

    ajax options, (err, xhr) ->
      alert('Problem getting exercise') if err

      # Success!
      config = JSON.parse(xhr.responseText)
      # Make sure all questions have ids
      idCounter = 0
      for question in config.questions or []
        question.id = "auto-#{idCounter++}" unless question.id

      root = document.createElement('div')
      root.id = 'exercise'
      document.body.appendChild(root)

      exercise = window.ExerciseComponent({config})
      window.React.render(exercise, root)

      # Save on every change
      ExerciseStore.addChangeListener ->

        options =
          url: url
          type: 'PUT'
          data: JSON.stringify(config)
          processData: false
          contentType: 'application/json'

        ajax options, (err, value) ->
          console.log('Save Response:', arguments...)


document.addEventListener('DOMContentLoaded', ->
  url = prompt('URL to fetch Exercise JSON\n (leave blank to use local test file)',
    '/api/exercises/1')
  if (url)
    request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = ->
      if (request.status >= 200 && request.status < 400)
        data = JSON.parse(request.responseText)

        root = document.getElementById('exercise')
        exercise = window.ExerciseComponent({config:data})
        window.React.render(exercise, root)

      else
        alert('Woops, server returned a non 200 error')

    request.onerror = ->
      alert('Woops, problem connecting to server')

    request.send()

  else
    window.ExerciseComponent(document.getElementById('exercise'), window.config)
    window.ExerciseActionsStore.ExerciseActions.changeExerciseMode(
      window.ExerciseActionsStore.EXERCISE_MODES.EDIT
    )

)

