{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobActions, JobStore} = require './job'
_ = require 'underscore'
moment = require 'moment'

PUBLISHING = 'publishing'
PUBLISH_QUEUED = 'publish_queued'
PUBLISHED = 'completed'
PUBLISH_FAILED = 'failed'
PUBLISH_KILLED = 'killed'

PlanPublishConfig = {

  _job: {}

  _loaded: (obj, id) ->
    @emit('planPublish.loaded', id)

  _updatePublishStatusFor: (id) ->
    (jobData) =>
      publishData = _.clone(jobData)
      publishData.publishFor = id

      @_asyncStatus[id] = publishData.status
      @emit("planPublish.#{publishData.status}", publishData)
      @emitChange()

  saveJob: (jobId, id) ->
    @_job[id] ?= []
    @_job[id].push(jobId)

  publish: (id) ->
    @_asyncStatus[id] = PUBLISHING
    @emitChange()

  published: (obj) ->
    {publish_job_uuid, id} = obj
    jobId = publish_job_uuid

    # publish job has been queued
    @emit('planPublish.queued', {jobId, id})
    @_asyncStatus[id] = PUBLISH_QUEUED
    @saveJob(jobId, id)

    # checks job until final status is reached
    checkJob = ->
      JobActions.load(jobId)
    JobActions.checkUntil(jobId, checkJob, 2000, 100)

    # whenever this job status is updated, emit the status for plan publish
    updatePublishStatus = @_updatePublishStatusFor(id)
    JobStore.on("job.#{jobId}.*", updatePublishStatus)
    JobStore.off("job.#{jobId}.final", updatePublishStatus)

  _getJobs: (id) ->
    _.clone(@_job[id])

  exports:
    isPublishing: (id) ->
      @_asyncStatus[id] is PUBLISHING or @_asyncStatus[id] is PUBLISH_QUEUED

    isPublished: (id, jobId) ->
      jobId ?= _.last(@_getJobs(id))
      job = JobStore.get(jobId)
      {status} = job if job?
      status is PUBLISHED

}

extendConfig(PlanPublishConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PlanPublishConfig)
module.exports = {PlanPublishActions:actions, PlanPublishStore:store}
