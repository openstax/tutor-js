# {JobActions, JobStore} = require '../flux/job'
_ = require 'underscore'

JOB_REQUESTING = 'job_requesting'
JOB_REQUESTED = 'job_queued'
JOB_UNSTARTED = 'unqueued'
JOB_QUEUED = 'queued'
JOB_STARTED = 'started'
JOBBED = 'succeeded'
JOB_FAILED = 'failed'
JOB_KILLED = 'killed'
JOB_UNKNOWN = 'unknown'
JOB_NOT_FOUND = 404

JOB_URL_BASE = '/api/jobs/'

getJobIdFromJobUrl = (jobUrl) ->
  jobUrlSegments = jobUrl.split(JOB_URL_BASE)
  jobId = jobUrlSegments[1] if jobUrlSegments[1]?

  jobId

JobListenerConfig = (checkIntervals, checkRepeats) ->
  {
    _asyncStatus: {}
    _job: {}

    reset: ->
      @_asyncStatus = {}
      @_job = {}
      @emitChange()

    _updateJobStatusFor: (id, jobData) ->
      progress = _.clone(jobData)
      progress.for = id

      @_asyncStatus[id] = progress.status
      @emit("progress.#{id}.#{progress.status}", progress)

    _stopListeningToJob: (jobId, updateJobStatus) ->
      JobStore.off("job.#{jobId}.*", updateJobStatus)

    saveJob: (jobId, id) ->
      @_job[id] ?= []
      @_job[id].push(jobId)

    que: (id) ->
      @_asyncStatus[id] = JOB_REQUESTING
      @emit("progress.#{id}.#{JOB_REQUESTING}")

    queued: (obj, id) ->
      if @_getIds?
        {jobId, id} = @_getIds(obj)
      else
        jobId = obj.jobId
        id = obj.id or id

      if jobId?
        # job has been queued
        # TODO fix this inconsistency between status and emit.
        @emit("progress.#{id}.queued", {jobId, id})
        @_asyncStatus[id] = JOB_REQUESTED
        @saveJob(jobId, id)

    startChecking: (id, jobId) ->
      latestJob = @_getLatestJob(id)

      @saveJob(jobId, id) if jobId? and jobId isnt latestJob
      jobId ?= latestJob
      return unless jobId?

      # checks job until final status is reached
      checkJob = ->
        JobActions.load(jobId)
      JobActions.checkUntil(jobId, checkJob, checkIntervals, checkRepeats)

      # whenever this job status is updated, emit the status for this wrapper's id
      # make functions for updating the status for what started the job
      # and for stopping updates
      updateJobStatus = _.bind(@_updateJobStatusFor, @, id)
      stopListening = _.bind(@_stopListeningToJob, @, jobId, updateJobStatus)

      # on all job updates, update the job status for jobId
      JobStore.on("job.#{jobId}.*", updateJobStatus)
      # on a final job status, stop listening for updates
      JobStore.once("job.#{jobId}.final", stopListening)

    stopChecking: (id) ->
      jobId = @_getLatestJob(id)
      JobActions.stopChecking(jobId) if jobId?

    _getJobs: (id) ->
      _.clone(@_job[id])

    _getLatestJob: (id) ->
      _.last(@_getJobs(id))

    exports:
      getAsyncStatus: (id) ->
        @_asyncStatus[id]

      isProgressing: (id) ->
        jobbingStates = [
          JOB_REQUESTING
          JOB_REQUESTED
          JOB_QUEUED
          JOB_STARTED
        ]

        jobbingStates.indexOf(@_asyncStatus[id]) > -1

      isFailed: (id) ->
        failedStates = [
          JOB_FAILED
          JOB_KILLED
          JOB_NOT_FOUND
        ]

        failedStates.indexOf(@_asyncStatus[id]) > -1

      isDone: (id) ->
        doneStates = [
          JOBBED
          JOB_FAILED
          JOB_KILLED
          JOB_NOT_FOUND
        ]

        doneStates.indexOf(@_asyncStatus[id]) > -1

      isSucceeded: (id, jobId) ->
        jobId ?= _.last(@_getJobs(id))
        job = JobStore.get(jobId)
        {status} = job if job?
        status is JOBBED
  }

JobHelper = {JobListenerConfig, getJobIdFromJobUrl}

module.exports = JobHelper
