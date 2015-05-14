require 'jquery'
require 'bootstrap' # Attach bootstrap to jQuery

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

api = require './src/api'
api.start()
router = require './src/router'

router.start(document.body)
