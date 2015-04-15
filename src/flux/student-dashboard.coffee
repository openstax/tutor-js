{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

StudentDashboardConfig = {

}

extendConfig(StudentDashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentDashboardConfig)
module.exports = {StudentDashboardActions:actions, StudentDashboardStore:store}
