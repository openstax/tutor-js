{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobListenerConfig} = require '../helpers/job'

getIds = (obj) ->
  {publish_job, id} = obj
  jobId = publish_job?.id or null
  {id, jobId}

PlanPublishConfig =
  _getIds: (obj) ->
    @exports._getIds(obj)

  exports:
    _getIds: getIds

extendConfig(PlanPublishConfig, new JobListenerConfig(2000, 200))

PlanPublishConfig.exports.isPublishing = PlanPublishConfig.exports.isProgressing
PlanPublishConfig.exports.isPublished = PlanPublishConfig.exports.isSucceeded

{actions, store} = makeSimpleStore(PlanPublishConfig)
module.exports = {PlanPublishActions:actions, PlanPublishStore:store}
