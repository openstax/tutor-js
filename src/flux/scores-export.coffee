{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobActions, JobStore} = require './job'
{JobListenerConfig} = require '../helpers/job'

_ = require 'underscore'
moment = require 'moment'

ScoresExportConfig = {
  _loaded: (obj, id) ->
    @emit('loaded', id)

  getJobIdFromJobUrl: (jobUrl) ->
    jobUrlSegments = jobUrl.split('/api/jobs/')
    jobId = jobUrlSegments[1] if jobUrlSegments[1]?

    jobId

  _getId: (obj, id) ->
    {job} = obj
    jobId = @getJobIdFromJobUrl(job)
    {jobId, id}

  exports:
    getLatestExport: (id) ->
      perfExports = @_get(id)

      _.chain(perfExports)
        .sortBy((perfExport) ->
          perfExport.created_at
        ).last().value()

}

JobCrudConfig = extendConfig(new JobListenerConfig(), new CrudConfig())
extendConfig(ScoresExportConfig, JobCrudConfig)

ScoresExportConfig.exports.isExported = ScoresExportConfig.exports.isCompleted
ScoresExportConfig.exports.isExporting = ScoresExportConfig.exports.isProgressing

ScoresExportConfig.export = (args...) ->
  @que.call(@, args...)
  @emitChange()

ScoresExportConfig.exported = (args...) ->
  @queued.call(@, args...)
  {id, jobId} = @_getId(args...)
  @startChecking.call(@, id, jobId)

{actions, store} = makeSimpleStore(ScoresExportConfig)
module.exports = {ScoresExportActions:actions, ScoresExportStore:store}
