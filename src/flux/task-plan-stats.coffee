{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'
PeriodHelper = require '../helpers/period'

TaskPlanStatsConfig = {

  exports:
    getPeriods: (id) ->
      plan = @_get(id)
      periods = _.chain(plan.stats)
        .map((stat) ->
          id: stat.period_id
          name: stat.name
        )
        .tap(PeriodHelper.sort)
        .value()

}


extendConfig(TaskPlanStatsConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanStatsConfig)
module.exports = {TaskPlanStatsActions:actions, TaskPlanStatsStore:store}
