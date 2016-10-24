require './api/error-notification.spec'

# require './api/index.spec'
# require './api/loader.spec'
require './breadcrumbs/index.spec'
# require './concept-coach/base.spec'
require './concept-coach/coach.spec'
require './concept-coach/error-notification.spec'
# uncommenting index spec this seems to throw rest off?
# require './concept-coach/index.spec'
require './concept-coach/laptop-and-mug.spec'
require './concept-coach/launcher/background-and-desk.spec'
# require './concept-coach/launcher/index.spec'
# require './concept-coach/modal.spec.cjsx'
require './concept-coach/safari-warning.spec'
require './course/confirm-join.spec'
require './course/enroll-or-login.spec'
# require './course/enrollment-code-input.spec'
require './course/error-list.spec'
require './course/model.spec'
require './course/new-registration.spec'
require './course/registration.spec'
# require './course/update-student-identifier.spec'
require './exercise/collection.spec'
# require './exercise/index.spec'
require './navigation/course-name.spec'
# require './navigation/index.spec'
# require './navigation/model.spec'
# require './progress/chapter.spec'
# require './progress/current.spec'
# require './progress/exercise.spec'
# require './progress/index.spec'
# require './task/collection.spec'
# require './task/index.spec'
# require './task/review.spec'
require './user/accounts-iframe.spec'
require './user/login-gateway.spec'
require './user/menu.spec'
require './user/model.spec'




# Once all specs are passing, remove the above and re-enable this:
#
# testsContext = require.context("./", true, /\.spec\.(cjsx|coffee)$/)
# testsContext.keys().forEach(testsContext)
