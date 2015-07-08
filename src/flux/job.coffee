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
      unless jobData.state is finalStatus or @_checkUntil[id].count > maxRepeats
        # if job state has checked, emit an update
        previousJobData = @_get(id)
        @emit("job.#{id}.updated", jobData) unless previousJobData?.state is obj.state

        setTimeout(checkJob, interval)
      else
        # otherwise, stop the checking, and emit the current state as the final state
        @emit("job.#{id}.final", jobData)
        delete @_checkUntil[id]

    jobData

  checkUntil: (id, checkJob, finalStatus = 'completed', interval = 500, maxRepeats = 20) ->
    @_checkUntil[id] = {checkJob, finalStatus, interval, maxRepeats, count: 0}
    checkJob()

  exports:

    getStatus: (id) ->
      {state} = @_get(id)
      state

}

extendConfig(JobConfig, new CrudConfig())
{actions, store} = makeSimpleStore(JobConfig)
module.exports = {JobActions:actions, JobStore:store}
