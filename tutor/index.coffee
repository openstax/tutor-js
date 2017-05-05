React = require 'react'
ReactDOM = require 'react-dom'

# Only load recordo for dev code for now
Recordo = require('recordo')
Recordo.initialize()
# Recordo.start()

{BootstrapURLs, UiSettings, ExerciseHelpers}  = require 'shared'

api = require './src/api'
Notices = require './src/helpers/notifications'
dom = require './src/helpers/dom'
{startMathJax} = require 'shared/src/helpers/mathjax'
{TransitionAssistant} = require './src/components/unsaved-state'
Root = require './src/components/root'
ErrorMonitoring = require 'shared/src/helpers/error-monitoring'
{ default: User } = require './src/models/user'
{ default: Courses } = require './src/models/courses-map'
{ default: Offerings } = require './src/models/course/offerings'
{Logging, ReactHelpers} = require 'shared'

window._STORES =
  SETTINGS: UiSettings
  APP: require './src/flux/app'
  COURSE: require './src/flux/course'
  EXERCISE: require './src/flux/exercise'
  PERFORMANCE_FORECAST: require './src/flux/performance-forecast'
  SCORES: require './src/flux/scores'
  STUDENT_DASHBOARD: require './src/flux/student-dashboard'
  TASK_PLAN: require './src/flux/task-plan'
  TASK_STEP: require './src/flux/task-step'
  TASK: require './src/flux/task'
  TEACHER_TASK_PLAN: require './src/flux/teacher-task-plan'
  TIME: require './src/flux/time'
  NOTIFICATIONS: require './src/flux/notifications'
  TOC: require './src/flux/toc'

window._MODELS =
  USER: User
  COURSES: Courses
  OFFERINGS: Offerings

window._LOGGING = Logging

# In dev builds this enables hot-reloading,
# in production it simply renders the root app

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  bootstrapData = dom.readBootstrapData()
  api.start(bootstrapData)
  BootstrapURLs.update(bootstrapData)

  UiSettings.initialize(bootstrapData.ui_settings)
  Notices.start(bootstrapData)
  ExerciseHelpers.setErrataFormURL(bootstrapData.errata_form_url)
  ErrorMonitoring.start()
  startMathJax()
  TransitionAssistant.startMonitoring()

  # Both require and module.hot.accept must be passed a bare string, not variable
  Renderer = ReactHelpers.renderRoot( ->
    require('./src/components/root')
  )
  module.hot.accept('./src/components/root', Renderer) if module.hot
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
