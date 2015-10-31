{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

JobConfig = {

  _checkUntil: {}

  _loaded: (obj, id) ->
    # if this job is in checking mode
    if @_checkUntil[id]?
      {finalStatus, checkJob, count, maxRepeats, interval} = @_checkUntil[id]
      @_checkUntil[id].count = count + 1
      jobData = _.extend({}, obj, {id})

      # unless the final status has been reached or
      # the max times this job should be checked has be exceeded,
      # check this job
      unless (finalStatus.indexOf(jobData.status) > -1) or @_checkUntil[id].count > maxRepeats
        # if job status has checked, emit an update
        previousJobData = @_get(id)
        @emit("job.#{id}.updated", jobData) unless previousJobData?.status is obj.status

        setTimeout(checkJob, interval)
      else
        # otherwise, stop the checking, and emit the current status as the final status
        @emit("job.#{id}.final", jobData)
        delete @_checkUntil[id]

    jobData

  checkUntil: (id, checkJob, interval = 1000, maxRepeats = 50, finalStatus = ['succeeded', 'failed', 'killed']) ->
    unless @_checkUntil[id]?
      @_checkUntil[id] = {checkJob, finalStatus, interval, maxRepeats, count: 0}
      checkJob()

  stopChecking: (id) ->
    delete @_checkUntil[id]

  exports:

    getStatus: (id) ->
      {status} = @_get(id)
      status

}

extendConfig(JobConfig, new CrudConfig())
{actions, store} = makeSimpleStore(JobConfig)
module.exports = {JobActions:actions, JobStore:store}
