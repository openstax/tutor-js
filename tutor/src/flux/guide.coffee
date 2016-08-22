{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CourseGuideConfig = {}

extendConfig(CourseGuideConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseGuideConfig)
module.exports = {CourseGuideActions:actions, CourseGuideStore:store}
