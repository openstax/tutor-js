{TaskPlanStatsActions, TaskPlanStatsStore} = require './task-plan-stats'
_ = require 'underscore'


{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskTeacherReviewConfig = {
  _loaded: (obj, id) ->
    if obj?.stats?
      planStats = _.clone(obj)
      _.each planStats.stats.periods, (period) ->
        delete period.current_pages.exercises if period.current_pages.exercises?
        delete period.spaced_pages.exercises if period.spaced_pages.exercises?

      TaskPlanStatsActions.loaded(planStats, id)

}


extendConfig(TaskTeacherReviewConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskTeacherReviewConfig)
module.exports = {TaskTeacherReviewActions:actions, TaskTeacherReviewStore:store}
