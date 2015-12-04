# coffeelint: disable=no_empty_functions
_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
PeriodHelper = require '../helpers/period'

DEFAULT_COURSE_TIMEZONE = 'US/Central'

DashboardConfig =
  exports:
    getPeriods: (courseId) ->
      _.chain(@_get(courseId)?.course?.periods)
        .tap(PeriodHelper.sort)
        .value()

    getPeriodChapters: (courseId, periodId) ->

      periods = @_get(courseId)?.course?.periods

      _.sortBy(_.findWhere(periods, {id: periodId})?.chapters, (chapter) ->
        parseInt(chapter.chapter_section?[0]))

    sortSections: (sections) ->
      _.sortBy sections, (section) ->
        chapterSection = section.chapter_section
        parseFloat("#{chapterSection[0]}.#{chapterSection[1]}")

extendConfig(DashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(DashboardConfig)
module.exports = {CCDashboardActions:actions, CCDashboardStore:store}
