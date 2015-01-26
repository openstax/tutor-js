React = require 'react'
{AnswerActions, AnswerStore} = require './stores/answer'
{ExerciseActions, ExerciseStore, EXERCISE_MODES} = require './stores/exercise'
Exercise = require './components/exercise'
ajax = require './ajax'


# Just for debugging
window.ExerciseActions = ExerciseActions
window.ExerciseStore = ExerciseStore
window.EXERCISE_MODES = EXERCISE_MODES
window.logout = -> ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)

# Determine if the user is logged in first
ajax {type:'GET', url: '/api/user'}, (err, xhr) ->

  isLoggedIn = !err
  if isLoggedIn
    ExerciseActions.changeExerciseMode(EXERCISE_MODES.EDIT)
  else
    ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)

  # ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)

  # Determine the URL to use based on the browser location
  if /\/exercises\/\d+/.test(window.location.pathname)
    url = "/api#{window.location.pathname}"

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

      React.renderComponent(Exercise({config}), root)

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
