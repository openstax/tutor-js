# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
_ = require 'underscore'

RESTORING = 'restoring'

PeriodConfig = {



  create: (courseId, params) ->

  # triggers api.coffee to restore
  restore: (periodId, courseId) ->
    @_asyncStatus[periodId] = RESTORING

  restored: (periodData, periodId, courseId) ->
    CourseActions.load(courseId)
    delete @_asyncStatus[periodId]

  _created: (period, courseId) ->
    CourseActions.load(courseId)
    @emit('created')

  _saved: (periodId, courseId) ->
    @emit('saved')
    CourseActions.load(courseId)
    null

  _deleted: (periodData, periodId, courseId) ->
    CourseActions.load(courseId)
    @emit('deleted')

  exports:
    isRestoring: (id) ->
      @_asyncStatus[id] is RESTORING

    validatePeriodName: (name, periods, active) ->
      for period in periods
        if period.name is name
          return ['periodNameExists'] unless name is active
      if not name? or name is ''
        return ['required']

}

extendConfig(PeriodConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PeriodConfig)
module.exports = {PeriodActions:actions, PeriodStore:store}
