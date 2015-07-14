{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

TaskPlanStatsConfig = {

  exports:
    getPeriods: (id) ->
      plan = @_get(id)
      periods = _.map(plan.stats, (stat) ->
        id: stat.period_id
        name: stat.name
      )

}


extendConfig(TaskPlanStatsConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanStatsConfig)
module.exports = {TaskPlanStatsActions:actions, TaskPlanStatsStore:store}
