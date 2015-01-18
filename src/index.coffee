React = require 'react'
{AnswerActions, AnswerStore} = require './flux/answer'
{ExerciseActions, ExerciseStore, EXERCISE_MODES} = require './flux/exercise'
{Exercise} = require './components'
ajax = require './ajax'






url = prompt('URL to fetch Exercise JSON\n (leave blank to use local test file)', '/api/exercises/1')
if url

  # fetch the exercise JSON
  options =
    url: url
    type: 'GET'

  ajax options, (err, xhr) ->
    throw new Error('Problem getting exercise') if err

    # Success!
    config = JSON.parse(xhr.responseText)
    root = document.createElement('div')
    root.id = 'exercise'
    document.body.appendChild(root)

    React.renderComponent(Exercise({config}), root)
    # TODO: Check if the user is authenticated to decide whether to view or edit the exercise
    ExerciseActions.changeExerciseMode(EXERCISE_MODES.EDIT)

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
