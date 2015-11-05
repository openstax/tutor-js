# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
_ = require 'underscore'

TeacherRosterConfig = {

  # create: (courseId, params) ->

  # created: (period, courseId) ->
  #   CourseActions.load(courseId)

  # save: (courseId, periodId, params) ->

  # saved: (periodId, courseId) ->
  #   CourseActions.load(courseId)

  # delete: (periodId, courseId) ->

  # deleted: (result, periodId, courseId) ->
  #   CourseActions.load(courseId)
    

  #exports:

    # validatePeriodName: (name, periods, active) ->
    #   for period in periods
    #     if period.name is name
    #       return ['periodNameExists'] unless name is active
    #   if not name? or name is ''
    #     return ['required']

}

extendConfig(TeacherRosterConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherRosterConfig)
module.exports = {TeacherRosterActions:actions, TeacherRosterStore:store}
