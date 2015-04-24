{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

PerformanceConfig = {}

extendConfig(PerformanceConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PerformanceConfig)
module.exports = {PerformanceActions:actions, PerformanceStore:store}
