{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskPlanStatsConfig = {

}


extendConfig(TaskPlanStatsConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanStatsConfig)
module.exports = {TaskPlanStatsActions:actions, TaskPlanStatsStore:store}
