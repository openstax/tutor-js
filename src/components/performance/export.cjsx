BS = require 'react-bootstrap'
React = require 'react'
moment = require 'moment'
BindStoreMixin = require '../bind-store-mixin'
AsyncButton = require '../buttons/async-button'

{PerformanceExportStore, PerformanceExportActions} = require '../../flux/performance-export'

PerformanceExport = React.createClass
  displayName: 'PerformanceExport'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    className: React.PropTypes.string

  mixins: [BindStoreMixin]
  bindStore: PerformanceExportStore

  getInitialState: ->
    downloadUrl: null
    lastExported: null
    triggerDownload: false
    exportedSinceLoad: false

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
      @setState(triggerDownload: true)

  updateDownload: (id) ->
    if @isUpdateValid(id)
      lastExport = PerformanceExportStore.getLatestExport(id)
      return unless lastExport?

      exportState =
        downloadUrl: lastExport.url
        lastExported: moment(lastExport.created_at).fromNow()

      @triggerDownload(lastExport.url) if @state.triggerDownload
      @setState(exportState)

  triggerDownload: (downloadUrl) ->
    window.location = downloadUrl
    @setState(triggerDownload: false, exportedSinceLoad: true)

  addBindListener: ->
    PerformanceExportStore.on('performanceExport.completed', @triggerLoadExport)
    PerformanceExportStore.on('performanceExport.loaded', @updateDownload)

  removeBindListener: ->
    PerformanceExportStore.off('performanceExport.completed', @triggerLoadExport)
    PerformanceExportStore.off('performanceExport.loaded', @updateDownload)

  render: ->
    {courseId, className} = @props
    {downloadUrl, lastExported, exportedSinceLoad} = @state

    className += ' export-button'
    exportClass = 'primary'
    exportClass = 'default' if exportedSinceLoad

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
      lastExportedTime = <i>{lastExported}</i>
      lastExportedTime = <a href={downloadUrl}>
        {lastExportedTime}
      </a> if downloadUrl?

      lastExportedLabel = <small className='export-button-time'>
        Last exported {lastExportedTime}
      </small>

    <span className={className}>
      <div className='export-button-buttons'>
        {exportButton}
      </div>
      {lastExportedLabel}
    </span>

module.exports = PerformanceExport
