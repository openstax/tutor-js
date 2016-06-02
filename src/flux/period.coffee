# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
_ = require 'underscore'

PeriodConfig = {

  create: (courseId, params) ->

  _created: (period, courseId) ->
    CourseActions.load(courseId)
    @emit('created')

  _saved: (periodId, courseId) ->
    @emit('saved')
    CourseActions.load(courseId)
    null

  _deleted: (result, periodId, courseId) ->
    CourseActions.load(courseId)
    @emit('deleted')

  exports:

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
