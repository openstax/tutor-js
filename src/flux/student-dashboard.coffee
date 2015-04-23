{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

StudentDashboardConfig = {

  exports:
    tasksForCourseID:(courseId)->
      @_get(courseId)?.items || []

}

extendConfig(StudentDashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentDashboardConfig)
module.exports = {StudentDashboardActions:actions, StudentDashboardStore:store}
