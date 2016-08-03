React = require 'react'

{AnswerActions, AnswerStore} = require './stores/answer'
{QuestionActions, QuestionStore} = require './stores/answer'
{ExerciseActions, ExerciseStore} = require './stores/exercise'

MathJaxHelper =  require 'shared/src/helpers/mathjax'
Exercise = require './components/exercise'
App = require './components/app'
api = require './api'


# Just for debugging
window.React = React
window.App = React.createFactory(App)
window.ExerciseActions = ExerciseActions
window.ExerciseStore = ExerciseStore
window.AnswerStore = AnswerStore
window.QuestionStore = QuestionStore
window.logout = -> ExerciseActions.changeExerciseMode(EXERCISE_MODES.VIEW)


loadApp = ->

  api.start()
  MathJaxHelper.startMathJax()

  root = document.createElement('div')
  document.body.appendChild(root)
  data = JSON.parse(
    document.getElementById('exercises-boostrap-data')?.innerHTML or '{}'
  )
  window.React.render(window.App({data}), root)

document.addEventListener('DOMContentLoaded', loadApp)
