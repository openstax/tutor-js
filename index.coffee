require 'jquery'
require 'bootstrap' # Attach bootstrap to jQuery

MathJax = window.MathJax

window._STORES =
  APP_CONFIG: require './src/flux/app-config'
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

MATHJAX_CONFIG =
  showProcessingMessages: false
  tex2jax:
    displayMath: [['\u200c\u200c\u200c', '\u200c\u200c\u200c']] # zero-width non-joiner
    inlineMath:  [['\u200b\u200b\u200b', '\u200b\u200b\u200b']] # zero-width space
  styles:
    "#MathJax_Message":    visibility: "hidden", left: "", right: 0
    "#MathJax_MSIE_Frame": visibility: "hidden", left: "", right: 0

if MathJax?.Hub
  MathJax.Hub.Config(MATHJAX_CONFIG)
  MathJax.Hub.Configured()
else
  MATHJAX_CONFIG.AuthorInit = ->
    MathJax.Hub.Configured()

  window.MathJax = MATHJAX_CONFIG

api = require './src/api'
api.start()
router = require './src/router'

router.start(document.body)
