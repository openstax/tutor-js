{expect} = require 'chai'

require './components/reading-plan.spec'
require './components/task.spec'
require './components/practice.spec'
require './components/learning-guide.spec'
require './components/course-calendar.spec'
require './components/student-dashboard.spec'

require './crud-store.spec'
require './task-store.spec'
require './loadable.spec'
require './teacher-task-plan-store.spec'

# This should be done **last** because it starts up the whole app
require './router.spec'
