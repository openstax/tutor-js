# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
_ = require 'underscore'

PeriodConfig = {

  create: (courseId, params) ->

  created: (period, courseId) ->
    CourseActions.load(courseId)

  save: (courseId, periodId, params) ->

  saved: (periodId, courseId) ->
    CourseActions.load(courseId)

  delete: (periodId, courseId) ->

  deleted: (result, periodId, courseId) ->
    CourseActions.load(courseId)
    

  exports:

    validatePeriodName: (name, periods) ->
      for period in periods
        if period.name is name
          return ['periodNameExists']
      if not name? or name is ''
        return ['required']

}

extendConfig(PeriodConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PeriodConfig)
module.exports = {PeriodActions:actions, PeriodStore:store}
