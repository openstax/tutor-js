{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

allStudents = (performances) ->
  _.chain(performances)
    .pluck('students')
    .flatten(true)
    .value()

PerformanceConfig = {
  exports:

    getStudent: (courseId, roleId) ->
      students = allStudents @_get(courseId)
      # TODO remove parseInt when BE fixes role to be string
      _.findWhere(allStudents(@_get(courseId)), role: parseInt(roleId))

    getAllStudents: (courseId) ->
      allStudents @_get(courseId)

    getStudentOfTask: (courseId, taskId) ->
      students = allStudents @_get(courseId)

      # TODO remove when BE fixed for ids to be strings instead of numbers
      taskId = parseInt(taskId)

      _.find students, (student) ->
        taskIds = _.pluck student.data, 'id'
        _.indexOf(taskIds, taskId) > -1
}

extendConfig(PerformanceConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PerformanceConfig)
module.exports = {PerformanceActions:actions, PerformanceStore:store}
