{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobActions, JobStore} = require './job'
_ = require 'underscore'
moment = require 'moment'

PUBLISHING = 'publishing'
PUBLISH_QUEUED = 'publish_queued'
PUBLISHED = 'completed'

PlanPublishConfig = {

  _job: {}

  _loaded: (obj, id) ->
    @emit('planPublish.loaded', id)

  _updatePublishStatusFor: (id) ->
    (jobData) =>
      publishData = _.clone(jobData)
      publishData.publishFor = id

      @_asyncStatus[id] = publishData.state
      @emit("planPublish.#{publishData.state}", publishData)
      @emitChange()

  getJobIdFromJobUrl: (jobUrl) ->
    jobUrlSegments = jobUrl.split('/api/jobs/')
    jobId = jobUrlSegments[1] if jobUrlSegments[1]?

    jobId

  saveJob: (jobId, id) ->
    @_job[id] ?= []
    @_job[id].push(jobId)

  publish: (id) ->
    @_asyncStatus[id] = PUBLISHING
    @emitChange()

  published: (obj, id) ->
    {job} = obj
    jobId = @getJobIdFromJobUrl(job)

    # publish job has been queued
    @emit('planPublish.queued', {jobId, id})
    @_asyncStatus[id] = PUBLISH_QUEUED
    @saveJob(jobId, id)

    # checks job until final status is reached
    checkJob = ->
      JobActions.load(jobId)
    JobActions.checkUntil(jobId, checkJob)

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
      {state} = job if job?
      state is PUBLISHED

    getLatestPublish: (id) ->
      plansPublish = @_get(id)

      _.chain(plansPublish)
        .sortBy((planPublish) ->
          planPublish.created_at
        ).last().value()


}

extendConfig(PlanPublishConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PlanPublishConfig)
module.exports = {PlanPublishActions:actions, PlanPublishStore:store}
