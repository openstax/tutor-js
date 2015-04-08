{expect} = require 'chai'

require './components/reading-plan.spec'
require './components/task.spec'
require './components/practice.spec'
require './components/guide.spec'

require './crud-store.spec'
require './task-store.spec'
require './loadable.spec'
require './teacher-task-plan-store.spec'

# This should be done **last** because it starts up the whole app
require './router.spec'
