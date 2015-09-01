require 'jquery'
require 'bootstrap' # Attach bootstrap to jQuery

api = require './src/api'
router = require './src/router'
dom = require './src/helpers/dom'
{startMathJax} = require './src/helpers/mathjax'
{TransitionAssistant} = require './src/components/unsaved-state'


window._STORES =
  APP: require './src/flux/app'
  COURSE: require './src/flux/course'
  CURRENT_USER: require './src/flux/current-user'
  EXERCISE: require './src/flux/exercise'
  LEARNING_GUIDE: require './src/flux/learning-guide'
  PERFORMANCE: require './src/flux/performance'
  STUDENT_DASHBOARD: require './src/flux/student-dashboard'
  TASK_PLAN: require './src/flux/task-plan'
  TASK_STEP: require './src/flux/task-step'
  TASK: require './src/flux/task'
  TEACHER_TASK_PLAN: require './src/flux/teacher-task-plan'
  TIME: require './src/flux/time'
  TOC: require './src/flux/toc'


loadApp = ->
  unless document.readyState is 'interactive'
    return false

  api.start(dom.readBootstrapData())
  startMathJax()
  TransitionAssistant.startMonitoring()
  # This is added because MathJax puts in extra divs on initial load.
  # Moves the React Root to be an element inside a div
  # instead of the only element in the body.
  mainDiv = document.createElement('div')
  mainDiv.id = 'react-root-container'
  document.body.appendChild(mainDiv)
  router.start(mainDiv)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
