chai = require 'chai'
sinonChai = require("sinon-chai")
chai.use(sinonChai)

# For some reason, this navbar component test will have warnings about setting
# state when component is unmounted if it's after some of the other specs.
# The tests still run and progress just fine despite the warnings, but for now,
# I'm leaving this test here.
# TODO figure out why.
require './components/course-listing.spec'
require './components/navbar.spec'
require './components/navbar/account-link.spec'
require './components/task-plan/homework-plan.spec'
require './components/task-plan/homework/exercise-summary.spec'
require './components/task-plan/footer.spec'
require './components/question.spec'
require './components/task.spec'
require './components/task-homework.spec'
require './components/task-homework-past-due.spec'
require './components/practice.spec'
require './components/course-calendar.spec'
require './components/learning-guide.spec'
require './components/learning-guide/chapter.spec'
require './components/learning-guide/section.spec'
require './components/learning-guide/practice-button.spec'
require './components/learning-guide/progress-bar.spec'
require './components/learning-guide/weaker-panel.spec'
require './components/learning-guide/weaker-sections.spec'
require './components/course-periods-nav.spec'
require './components/student-dashboard.spec'
require './components/student-dashboard/progress-guide.spec'
require './components/reference-book.spec'
require './components/course-settings.spec'
require './components/icon.spec'
require './components/tutor-input.spec'
require './components/tutor-dialog.spec'
require './components/unsaved-state.spec'
require './components/buttons/browse-the-book.spec'
require './components/book-content-mixin.spec'
require './components/performance/reading-cell.spec'
require './components/performance/homework-cell.spec'
require './components/name.spec'

require './crud-store.spec'
require './task-store.spec'
require './loadable.spec'
require './teacher-task-plan-store.spec'
require './learning-guide-store.spec'
require './step-panel-policy.spec'
require './time.spec'
require './current-user-store.spec'
require './course-listing-store.spec'
require './task-helpers.spec'
require './dom-helpers.spec'

# This should be done **last** because it starts up the whole app
require './router.spec'
