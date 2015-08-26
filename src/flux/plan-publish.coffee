{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobActions, JobStore} = require './job'
{JobListenerConfig} = require '../helpers/job'
_ = require 'underscore'
moment = require 'moment'

PlanPublishConfig =
  _getIds: (obj) ->
    {publish_job_uuid, id} = obj
    jobId = publish_job_uuid
    {id, jobId}

JobCrudConfig = extendConfig(new JobListenerConfig(), new CrudConfig())
extendConfig(PlanPublishConfig, JobCrudConfig)

PlanPublishConfig.exports.isPublishing = PlanPublishConfig.exports.isProgressing
PlanPublishConfig.exports.isPublished = PlanPublishConfig.exports.isCompleted

{actions, store} = makeSimpleStore(PlanPublishConfig)
module.exports = {PlanPublishActions:actions, PlanPublishStore:store}
