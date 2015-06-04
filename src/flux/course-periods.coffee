{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CoursePeriodsConfig = {

}


extendConfig(CoursePeriodsConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CoursePeriodsConfig)
module.exports = {CoursePeriodsActions:actions, CoursePeriodsStore:store}
