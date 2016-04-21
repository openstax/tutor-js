{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

allStudents = (scores) ->
  _.chain(scores)
    .pluck('students')
    .flatten(true)
    .value()

ScoresConfig = {
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


    recalcAverages: (courseId, period_id) ->
      scores = @_get(courseId)
      period = _.findWhere(scores, {period_id})
      # console.log period
      period.data_headings[1].total_average = 87
      change = _.findWhere(period.students, {role:8})
      change?.first_name = "Fred"
      change?.last_name = "Flinstone"
      change?.name = "Fred Flinstone"
      #@_change(courseId, {data})
      @_save(courseId)
      @emit('change', courseId)


}

extendConfig(ScoresConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ScoresConfig)
module.exports = {ScoresActions:actions, ScoresStore:store}
