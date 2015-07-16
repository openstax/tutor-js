{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

LearningGuideTeacherConfig = {

}


extendConfig(LearningGuideTeacherConfig, new CrudConfig())
{actions, store} = makeSimpleStore(LearningGuideTeacherConfig)
module.exports = {LearningGuideTeacherActions:actions, LearningGuideTeacherStore:store}
