moment = require 'moment'
_ = require 'underscore'

{PlanPublishStore, PlanPublishActions} = require '../flux/plan-publish'
{TimeStore, TimeActions} = require '../flux/time'

PlanHelper =
  isPublishing: (plan, recentTolerance = 3600000) ->
    isPublishing = (plan.is_publish_requested? and plan.is_publish_requested) or plan.publish_last_requested_at?
    if plan.published_at? and plan.publish_last_requested_at?
      # is the last requested publishing after the last successful publish?
      isPublishing = moment(plan.publish_last_requested_at).diff(plan.published_at) > 0
    else if plan.published_at? and not plan.publish_last_requested_at?
      isPublishing = false
    else if plan.publish_last_requested_at?
      recent = moment(TimeStore.getNow()).diff(plan.publish_last_requested_at) < recentTolerance
      isPublishing = isPublishing and recent

    isPublishing

  subscribeToPublishing: (plan, callback) ->
    {id, publish_job_uuid} = plan
    isPublishing = PlanHelper.isPublishing(plan)

    publishStatus = PlanPublishStore.getAsyncStatus(id)
    isPublishingInStore = PlanPublishStore.isPublishing(id)

    if isPublishing and not isPublishingInStore and not PlanPublishStore.isPublished(id)
      PlanPublishActions.queued({id, publish_job_uuid}) if publish_job_uuid?

    isPublishing = isPublishing or isPublishingInStore

    if isPublishing
      PlanPublishActions.startChecking(id, publish_job_uuid)
      PlanPublishStore.on("progress.#{id}.*", callback) if callback? and _.isFunction(callback)

    {isPublishing, publishStatus}


module.exports = PlanHelper
