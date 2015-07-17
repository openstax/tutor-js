{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

LearningGuideCommon = require './learning-guide-common'

LearningGuideTeacherConfig = {
  exports:
    getChaptersForPeriod: (courseId, periodId) ->
      period = _.findWhere(@_get(courseId), period_id: periodId)
      period?.children or []

    getSectionsForPeriod: (courseId, periodId) ->
      period = _.findWhere(@_get(courseId), period_id: periodId)
      LearningGuideCommon.findAllSections(period)

}


extendConfig(LearningGuideTeacherConfig, new CrudConfig())
{actions, store} = makeSimpleStore(LearningGuideTeacherConfig)
module.exports = {LearningGuideTeacherActions:actions, LearningGuideTeacherStore:store}
