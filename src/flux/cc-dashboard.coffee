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

    chaptersForDisplay: (courseId, periodId) ->
      period = _.findWhere( @_get(courseId)?.course?.periods, {id: periodId})
      return [] unless period
      chapters = _.map period.chapters, (chapter) ->
        valid_sections = _.select chapter.pages, (page) ->
          total = page.completed + page.in_progress + page.not_started
          page.completed_percentage = page.completed / total
          page.completed_percentage > 0.1
        chapter.valid_sections = _.sortBy(valid_sections, (page) ->
          page.chapter_section[1] or 0
        ).reverse()
        chapter
      chapters.reverse()


extendConfig(DashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(DashboardConfig)
module.exports = {CCDashboardActions:actions, CCDashboardStore:store}
