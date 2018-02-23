React = require 'react'
{ReactHelpers} = require 'shared'
{AnswerActions, AnswerStore} = require './stores/answer'
{QuestionActions, QuestionStore} = require './stores/answer'
{ExerciseActions, ExerciseStore} = require './stores/exercise'

MathJaxHelper =  require 'shared/helpers/mathjax'
Exercise = require './components/exercise'
api = require './api'


# Just for debugging
window.React = React
#window.App = React.createFactory(App)
window.ExerciseActions = ExerciseActions
window.ExerciseStore = ExerciseStore
window.AnswerStore = AnswerStore
window.QuestionStore = QuestionStore
window.logout = -> ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)


loadApp = ->

  api.start()
  MathJaxHelper.startMathJax()
  data = JSON.parse(
    document.getElementById('exercises-boostrap-data')?.innerHTML or '{}'
  )
  # Both require and module.hot.accept must be passed a bare string, not variable
  Renderer = ReactHelpers.renderRoot( ->
    Component = require('./components/app')
    -> React.createElement(Component, {data})
  )
  module.hot.accept('./components/app', Renderer) if module.hot

document.addEventListener('DOMContentLoaded', loadApp)
