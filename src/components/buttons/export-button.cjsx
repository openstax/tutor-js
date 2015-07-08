BS = require 'react-bootstrap'
React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
Time = require '../time'
AsyncButton = require './async-button'

{PerformanceExportStore, PerformanceExportActions} = require '../../flux/performance-export'

module.exports = React.createClass
  displayName: 'ExportPerformance'

  mixins: [BindStoreMixin]
  bindStore: PerformanceExportStore

  getInitialState: ->
    downloadUrl: null
    lastExported: null

  isUpdateValid: (id) ->
    {courseId} = @props
    id is courseId

  componentWillMount: ->
    {courseId} = @props
    PerformanceExportActions.load(courseId)

  triggerLoadExport: (exportData) ->
    {courseId} = @props
    if @isUpdateValid(exportData.exportFor)
      PerformanceExportActions.load(courseId)

  updateDownload: (id) ->
    if @isUpdateValid(id)
      lastExport = PerformanceExportStore.getLatestExport(id)
      return unless lastExport?

      exportState =
        downloadUrl: lastExport.url
        lastExported: lastExport.created_at

      @setState(exportState)

  addBindListener: ->
    PerformanceExportStore.on('performanceExport.completed', @triggerLoadExport)
    PerformanceExportStore.on('performanceExport.loaded', @updateDownload)

  removeBindListener: ->
    PerformanceExportStore.off('performanceExport.completed', @triggerLoadExport)
    PerformanceExportStore.off('performanceExport.loaded', @updateDownload)

  render: ->
    {courseId, className} = @props
    {downloadUrl, lastExported} = @state

    className += ' export-button'
    exportClass = 'primary'

    if downloadUrl?
      downloadLink =
        <BS.Button bsStyle='primary' href={downloadUrl}>Download</BS.Button>

      exportClass = 'default'

    exportButton =
      <AsyncButton
        bsStyle={exportClass}
        onClick={-> PerformanceExportActions.export(courseId)}
        isWaiting={PerformanceExportStore.isExporting(courseId)}
        isFailed={PerformanceExportStore.isFailed(courseId)}
        waitingText='Exporting…'>
        Export
      </AsyncButton>

    if lastExported?
      lastExportedLabel = <small className='export-button-time'>
        Export last updated on:
        <i><Time date={lastExported} format='long'/></i>
      </small>

    <span className={className}>
      <div className='export-button-buttons'>
        {exportButton}
        {downloadLink}
      </div>
      {lastExportedLabel}
    </span>
