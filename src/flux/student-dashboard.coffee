{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
moment = require 'moment'

StudentDashboardConfig = {

  exports:
    tasksForCourseID:(courseId) ->
      @_get(courseId)?.items or []

    # This should be cached, but not bothering since feed is changing
    eventsByWeek: (courseId) ->
      tasks = @_get(courseId)?.items or []
      weeks = {}
      for task in tasks
        key = moment(task.due_at).format("YYYYww")
        (weeks[key] ||= []).push task
      weeks


}

extendConfig(StudentDashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentDashboardConfig)
module.exports = {StudentDashboardActions:actions, StudentDashboardStore:store}
