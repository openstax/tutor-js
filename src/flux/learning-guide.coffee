{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

LearningGuideConfig = {

}


extendConfig(LearningGuideConfig, new CrudConfig())
{actions, store} = makeSimpleStore(LearningGuideConfig)
module.exports = {LearningGuideActions:actions, LearningGuideStore:store}
