moment = require 'moment'
_ = require 'underscore'

{PlanPublishStore, PlanPublishActions} = require '../flux/plan-publish'
{TaskPlanActions} = require '../flux/task-plan'
{TimeStore} = require '../flux/time'

PlanHelper =
  isPublishing: (plan) ->
    plan.is_publishing

  startChecking: ({id, jobId}, callback) ->
    PlanPublishActions.startChecking(id, jobId)
    PlanPublishStore.on("progress.#{id}.*", callback) if callback? and _.isFunction(callback)

  unsubscribeFromPublishing: (planId, callback) ->
    PlanPublishStore.removeAllListeners("progress.#{planId}.*", callback) if callback? and _.isFunction(callback)

  subscribeToPublishing: (plan, callback) ->
    {jobId, id} = PlanPublishStore._getIds(plan)
    isPublishing = PlanHelper.isPublishing(plan) or false

    publishStatus = PlanPublishStore.getAsyncStatus(id)
    isPublishingInStore = PlanPublishStore.isPublishing(id)

    if isPublishing and
      not isPublishingInStore and
      not PlanPublishStore.isPublished(id) and
      not jobId
        TaskPlanActions.load(plan.id)
        PlanPublishStore.once("progress.#{id}.queued", _.partial(PlanHelper.startChecking, _, callback))

    else if isPublishing or isPublishingInStore

      PlanHelper.startChecking({id, jobId}, callback)
      isPublishing = true

    {isPublishing, publishStatus}


module.exports = PlanHelper
