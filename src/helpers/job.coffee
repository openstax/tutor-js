{JobActions, JobStore} = require '../flux/job'
_ = require 'underscore'
moment = require 'moment'

JOB_REQUESTING = 'job_requesting'
JOB_REQUESTED = 'job_queued'
JOB_UNSTARTED = 'unknown'
JOBBING = 'working'
JOB_QUEUED = 'queued'
JOBBED = 'completed'
JOB_FAILED = 'failed'
JOB_KILLED = 'killed'

JobListenerConfig = (checkIntervals, checkRepeats) ->
  {
    _asyncStatus: {}
    _job: {}

    reset: ->
      @_asyncStatus = {}
      @_job = {}
      @emitChange()

    _updateJobStatusFor: (id) ->
      (jobData) =>
        progress = _.clone(jobData)
        progress.for = id

        @_asyncStatus[id] = progress.status
        @emit("progress.#{id}.#{progress.status}", progress)

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
      lastestJob = @_getLatestJob(id)
      @saveJob(jobId, id) if jobId? and jobId isnt lastestJob
      jobId ?= lastestJob
      return unless jobId?

      # checks job until final status is reached
      checkJob = ->
        JobActions.load(jobId)
      JobActions.checkUntil(jobId, checkJob, checkIntervals, checkRepeats)

      # whenever this job status is updated, emit the status for this wrapper
      updateJobStatus = @_updateJobStatusFor(id)
      JobStore.on("job.#{jobId}.*", updateJobStatus)
      JobStore.off("job.#{jobId}.final", updateJobStatus)

    stopChecking: (id) ->
      jobId = @_getLatestJob(id)
      JobActions.stopChecking(jobId) if jobId?

    _getJobs: (id) ->
      _.clone(@_job[id])

    _getLatestJob: (id) ->
      _.last(@_getJobs(id))

    exports:
      getAsyncStatus: (id) -> @_asyncStatus[id]

      isProgressing: (id) ->
        jobbingStates = [
          JOB_REQUESTING
          JOB_REQUESTED
          JOB_QUEUED
          JOBBING
        ]

        jobbingStates.indexOf(@_asyncStatus[id]) > -1

      isFailed: (id) ->
        failedStates = [
          JOB_FAILED
          JOB_KILLED
        ]

        failedStates.indexOf(@_asyncStatus[id]) > -1

      isDone: (id) ->
        doneStates = [
          JOBBED
          JOB_FAILED
          JOB_KILLED
        ]

        doneStates.indexOf(@_asyncStatus[id]) > -1

      isCompleted: (id, jobId) ->
        jobId ?= _.last(@_getJobs(id))
        job = JobStore.get(jobId)
        {status} = job if job?
        status is JOBBED
  }

JobHelper = {JobListenerConfig}

module.exports = JobHelper
