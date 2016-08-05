moment = require 'moment'
_ = require 'underscore'

{PlanPublishStore, PlanPublishActions} = require '../flux/plan-publish'
{TimeStore, TimeActions} = require '../flux/time'

PlanHelper =
  isPublishing: (plan) ->
    plan.is_publishing

  subscribeToPublishing: (plan, callback) ->
    {jobId, id} = PlanPublishStore._getIds(plan)
    isPublishing = PlanHelper.isPublishing(plan)

    publishStatus = PlanPublishStore.getAsyncStatus(id)
    isPublishingInStore = PlanPublishStore.isPublishing(id)

    if isPublishing and not isPublishingInStore and not PlanPublishStore.isPublished(id)
      PlanPublishActions.queued(plan, id) if jobId

    isPublishing = isPublishing or isPublishingInStore

    if isPublishing
      PlanPublishActions.startChecking(id, jobId)
      PlanPublishStore.on("progress.#{id}.*", callback) if callback? and _.isFunction(callback)

    {isPublishing, publishStatus}


module.exports = PlanHelper
