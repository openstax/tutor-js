{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobActions, JobStore} = require './job'
_ = require 'underscore'
moment = require 'moment'

PUBLISH_REQUESTING = 'publish_requesting'
PUBLISH_REQUESTED = 'publish_queued'
PUBLISHING = 'working'
PUBLISH_QUEUED = 'queued'
PUBLISHED = 'completed'
PUBLISH_FAILED = 'failed'
PUBLISH_KILLED = 'killed'

PlanPublishConfig = {

  _job: {}

  _loaded: (obj, id) ->
    @emit("planPublish.#{id}.loaded", id)

  _updatePublishStatusFor: (id) ->
    (jobData) =>
      publishData = _.clone(jobData)
      publishData.publishFor = id

      @_asyncStatus[id] = publishData.status
      @emit("planPublish.#{id}.#{publishData.status}", publishData)
      @emitChange()

  saveJob: (jobId, id) ->
    @_job[id] ?= []
    @_job[id].push(jobId)

  publish: (id) ->
    @_asyncStatus[id] = PUBLISH_REQUESTING
    @emitChange()

  published: (obj) ->
    {publish_job_uuid, id} = obj
    jobId = publish_job_uuid

    # publish job has been queued
    @emit("planPublish.#{id}.queued", {jobId, id})
    @_asyncStatus[id] = PUBLISH_REQUESTED
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
      publishingStates = [
        PUBLISH_REQUESTING
        PUBLISH_REQUESTED
        PUBLISH_QUEUED
        PUBLISHING
      ]

      publishingStates.indexOf(@_asyncStatus[id]) > -1

    isFailed: (id) ->
      failedStates = [
        PUBLISH_FAILED
        PUBLISH_KILLED
      ]

      failedStates.indexOf(@_asyncStatus[id]) > -1

    isDone: (id) ->
      doneStates = [
        PUBLISHED
        PUBLISH_FAILED
        PUBLISH_KILLED
      ]

      doneStates.indexOf(@_asyncStatus[id]) > -1

    isPublished: (id, jobId) ->
      jobId ?= _.last(@_getJobs(id))
      job = JobStore.get(jobId)
      {status} = job if job?
      status is PUBLISHED

}

extendConfig(PlanPublishConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PlanPublishConfig)
module.exports = {PlanPublishActions:actions, PlanPublishStore:store}
