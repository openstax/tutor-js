{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

PerformanceConfig = {
  exports:
    getStudentOfTask: (courseId, taskId) ->
      performances = @_get(courseId)
      students = _.chain(performances)
        .pluck('students')
        .flatten(true)
        .value()

      # TODO remove when BE fixed for ids to be strings instead of numbers
      taskId = parseInt(taskId)

      _.find students, (student) ->
        taskIds = _.pluck student.data, 'id'
        _.indexOf(taskIds, taskId) > -1
}

extendConfig(PerformanceConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PerformanceConfig)
module.exports = {PerformanceActions:actions, PerformanceStore:store}
