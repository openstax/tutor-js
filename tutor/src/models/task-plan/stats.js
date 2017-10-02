{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'
{default: PeriodHelper} = require '../helpers/period'

TaskPlanStatsConfig = {

  exports:
    getPeriods: (id) ->
      plan = @_get(id)
      periods = _.chain(plan.stats)
        # filter out deleted periods
        .filter (stat) -> stat.period_id?
        .map (stat) ->
          id: stat.period_id
          name: stat.name
          is_trouble: stat.is_trouble
        .value()

      # tapping into the sort wasn't actually returning sorted
      # periods for some reason
      PeriodHelper.sort(periods)

}


extendConfig(TaskPlanStatsConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanStatsConfig)
module.exports = {TaskPlanStatsActions:actions, TaskPlanStatsStore:store}
