{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

LearningGuideCommon = require './learning-guide-common'

LearningGuideStudentConfig = {

  exports:

    getSortedSections: (courseId, property = 'current_level') ->
      sections = LearningGuideCommon.findAllSections(@_get(courseId))
      _.sortBy(sections, property)

}


extendConfig(LearningGuideStudentConfig, new CrudConfig())
{actions, store} = makeSimpleStore(LearningGuideStudentConfig)
module.exports = {LearningGuideStudentActions:actions, LearningGuideStudentStore:store}
