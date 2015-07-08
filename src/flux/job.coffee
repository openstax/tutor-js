{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

JobConfig = {

  _checkUntil: {}

  _loaded: (obj, id) ->
    if @_checkUntil[id]?
      {finalStatus, count, maxRepeats, interval} = @_checkUntil[id]
      @_checkUntil[id].count = count + 1
      jobData = _.extend({}, obj, {id, id})

      checkAgain = ->
        @load(id)

      if not finalStatus is obj.state and not count is maxRepeats
        {state} = @_get(id)
        @emit("job.#{id}.updated", jobData) if not state is obj.state
        setTimeout(checkAgain, interval)
      else
        @emit("job.#{id}.final", jobData)
        delete @_checkUntil[id]

  checkUntil: (id, finalStatus = 'completed', interval = 500, maxRepeats = 20) ->
    @_checkUntil[id] = {finalStatus, interval, maxRepeats, count: 0}

  exports:

    getStatus: (id) ->
      {state} = @_get(id)
      state

}

extendConfig(JobConfig, new CrudConfig())
{actions, store} = makeSimpleStore(JobConfig)
module.exports = {JobActions:actions, JobStore:store}
