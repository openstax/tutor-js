# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

RosterConfig = {

  create: (courseId, params) ->

  created: (student, courseId) ->
    @_local[courseId].push(student)
    @emitChange()

  save: (courseId, studentId, params) ->

  saved: (newProps, studentId) ->
    # update the student from all the courses rosters
    for courseId, roster of @_local
      student = _.findWhere(roster, id: studentId)
      _.extend(student, newProps) if student
    @emitChange()

  deleted: (unused, studentId) ->
    # remove the student from all the courses rosters
    for courseId, roster of @_local
      index = _.findIndex(roster, id: studentId)
      roster.splice(index, 1) unless -1 is index
    @emitChange()

  exports:

    getStudentsForPeriod: (courseId, periodId) ->
      _.where(@_get(courseId), period_id: periodId)

}

extendConfig(RosterConfig, new CrudConfig())
{actions, store} = makeSimpleStore(RosterConfig)
module.exports = {RosterActions:actions, RosterStore:store}
