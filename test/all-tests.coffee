{expect} = require 'chai'

# For some reason, this navbar component test will have warnings about setting
# state when component is unmounted if it's after some of the other specs.
# The tests still run and progress just fine despite the warnings, but for now,
# I'm leaving this test here.
# TODO figure out why.
require './components/course-listing.spec'
require './components/navbar.spec'
require './components/task-plan/homework-plan.spec'
require './components/task-plan/homework/exercise-summary.spec'
require './components/task-plan/footer.spec'

require './components/task.spec'
require './components/task-homework.spec'
require './components/task-homework-past-due.spec'
require './components/practice.spec'
require './components/learning-guide.spec'
require './components/course-periods-nav.spec'
require './components/course-calendar.spec'
require './components/student-dashboard.spec'
require './components/reference-book.spec'
require './components/course-settings.spec'
require './components/tutor-input.spec'

require './crud-store.spec'
require './task-store.spec'
require './loadable.spec'
require './teacher-task-plan-store.spec'
require './step-panel-policy.spec'
require './time.spec'
require './current-user-store.spec'
require './course-listing-store.spec'
require './task-helpers.spec'

# # # This should be done **last** because it starts up the whole app
require './router.spec'
