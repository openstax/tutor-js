# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

SAVING = 'saving'

RosterConfig = {

  _asyncStatus: {}

  create: (courseId, params) ->

  created: (student, courseId) ->
    @_local[courseId].push(student)
    @emitChange()

  save: (courseId, studentId, params) ->
    @_asyncStatus[studentId] = SAVING
    @emitChange()

  saved: (newProps, studentId) ->
    # update the student from all the courses rosters
    for courseId, roster of @_local
      students = roster.students
      student = _.findWhere(students, id: studentId)
      _.extend(student, newProps) if student
    @emitChange()

  deleted: (unused, studentId) ->
    # remove the student from all the courses rosters
    for courseId, roster of @_local
      students = roster.students
      index = _.findIndex(students, id: studentId)
      students.splice(index, 1) unless -1 is index
    @emitChange()

  exports:

    getActiveStudentsForPeriod: (courseId, periodId) ->
      _.where(@_get(courseId).students, period_id: periodId, is_active: true)

    isSaving: (studentId) -> @_asyncStatus[studentId] is SAVING

}

extendConfig(RosterConfig, new CrudConfig())
{actions, store} = makeSimpleStore(RosterConfig)
module.exports = {RosterActions:actions, RosterStore:store}
