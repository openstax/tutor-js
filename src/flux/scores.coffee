# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'


ACCEPTING = 'accepting'
ACCEPTED = 'accepted'

REJECTING = 'rejecting'
REJECTED = 'rejected'



allStudents = (scores) ->
  _.chain(scores)
    .pluck('students')
    .flatten(true)
    .value()


ScoresConfig = {

  _asyncStatus: {}


  getTaskById: (taskId, courseId) ->
    students = allStudents @_get(courseId)
    data = _.flatten(_.pluck(students, 'data'))
    task = _.findWhere(data, {id: taskId})
    task

  updateAverages: (task, courseId, period_id, columnIndex, isAccepted, currentValue, acceptValue) ->
    scores = @_get(courseId)
    period = _.findWhere(scores, {period_id})
    numStudents = period.students.length
    currentValue = currentValue / 100
    acceptValue = acceptValue / 100

    currentAssignmentAverage = period?.data_headings[columnIndex]?.average_score

    assignmentAverage =
      (currentAssignmentAverage - (currentValue / numStudents)) + (acceptValue / numStudents)

    period?.data_headings[columnIndex]?.average_score = assignmentAverage


    period?.overall_average_score = 79



    students = allStudents @_get(courseId)
    taskId = parseInt(task.id)

    taskStudent =
      _.find students, (student) ->
        taskIds = _.pluck student.data, 'id'
        _.indexOf(taskIds, taskId) > -1

    taskStudent?.average_score = 79


  acceptLate: (taskId) ->
    @_asyncStatus[taskId] = ACCEPTING
    @emitChange()

  acceptedLate: (unused, taskId, courseId) ->
    @_asyncStatus[taskId] = ACCEPTED
    task = @getTaskById(taskId, courseId)
    task.is_late_work_accepted = true
    @emitChange()

  rejectLate: (taskId) ->
    @_asyncStatus[taskId] = REJECTING
    @emitChange()

  rejectedLate: (unused, taskId, courseId) ->
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


}

extendConfig(ScoresConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ScoresConfig)
module.exports = {ScoresActions:actions, ScoresStore:store}
