# coffeelint: disable=no_empty_functions
_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
PeriodHelper = require '../helpers/period'

DEFAULT_COURSE_TIMEZONE = 'US/Central'

DashboardConfig =
  exports:
    getPeriods: (courseId) -> @_get(courseId)?.course?.periods

    getPeriodChapters: (courseId, periodId) ->

      periods = @_get(courseId)?.course?.periods

      _.sortBy(_.findWhere(periods, {id: periodId})?.chapters, (chapter) ->
        chapter.chapter_section?[0])?.reverse()

    

extendConfig(DashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(DashboardConfig)
module.exports = {CCDashboardActions:actions, CCDashboardStore:store}
