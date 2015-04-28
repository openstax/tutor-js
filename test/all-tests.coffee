{expect} = require 'chai'

require './components/homework/homework-plan.spec'
require './components/homework/exercise-summary.spec'
require './components/reading-plan.spec'

require './components/task.spec'
require './components/task-homework.spec'
require './components/task-homework-past-due.spec'
require './components/practice.spec'
require './components/learning-guide.spec'
require './components/course-calendar.spec'

require './crud-store.spec'
require './task-store.spec'
require './loadable.spec'
require './teacher-task-plan-store.spec'
require './step-panel-policy.spec'
require './time.spec'

# This should be done **last** because it starts up the whole app
require './router.spec'
