{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobActions, JobStore} = require './job'
{JobListenerConfig} = require '../helpers/job'

_ = require 'underscore'
moment = require 'moment'

PerformanceExportConfig = {

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
extendConfig(PerformanceExportConfig, JobCrudConfig)

PerformanceExportConfig.exports.isExported = PerformanceExportConfig.exports.isCompleted
PerformanceExportConfig.exports.isExporting = PerformanceExportConfig.exports.isProgressing

PerformanceExportConfig.export = (args...) ->
  @que.call(@, args...)
  @emitChange()

PerformanceExportConfig.exported = (args...) ->
  @queued.call(@, args...)
  {id, jobId} = @_getId(args...)
  @startChecking.call(@, id, jobId)

{actions, store} = makeSimpleStore(PerformanceExportConfig)
module.exports = {PerformanceExportActions:actions, PerformanceExportStore:store}
