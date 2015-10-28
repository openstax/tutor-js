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
      error = ''
      maxLength = 20
      for period in periods
        if period.name is name
          error = 'Period name already exists.'
      if not name? or name is ''
        error = 'Period name is required.'
      if name?.length > maxLength
        error = "Period name must be #{maxLength} characters or less."
      if not error and name?.match(/[^A-Z0-9-. ]+/ig)
        error = "Period name must contain only letters, numbers, periods or hyphens."
      {error}

}

extendConfig(PeriodConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PeriodConfig)
module.exports = {PeriodActions:actions, PeriodStore:store}
