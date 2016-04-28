# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

allStudents = (scores) ->
  _.chain(scores)
    .pluck('students')
    .flatten(true)
    .value()


ACCEPTING = 'accepting'
ACCEPTED = 'accepted'

REJECTING = 'rejecting'
REJECTED = 'rejected'


ScoresConfig = {

  _asyncStatus: {}


  getTaskById: (taskId, courseId) ->
    students = allStudents @_get(courseId)
    data = _.flatten(_.pluck(students, 'data'))
    task = _.findWhere(data, {id: taskId})
    task

  acceptLate: (taskId) ->
    @_asyncStatus[taskId] = ACCEPTING
    @emitChange()

  acceptedLate: (unused, taskId, courseId, period_id) ->
    @_asyncStatus[taskId] = ACCEPTED
    task = @getTaskById(taskId, courseId)
    task.is_late_work_accepted = true
    @emitChange()

  rejectLate: (taskId) ->
    @_asyncStatus[taskId] = REJECTING
    @emitChange()

  rejectedLate: (unused, taskId, courseId, period_id) ->
    @_asyncStatus[taskId] = REJECTED
    task = @getTaskById(taskId, courseId)
    task.is_late_work_accepted = false
    @emitChange()


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



    isUpdatingLateStatus: (taskId) -> 
      @_asyncStatus[taskId] is ACCEPTING or
      @_asyncStatus[taskId] is REJECTING

    recalcAverages: (courseId, period_id) ->
      scores = @_get(courseId)
      period = _.findWhere(scores, {period_id})
      console.log period
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
