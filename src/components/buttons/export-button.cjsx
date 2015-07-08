BS = require 'react-bootstrap'
React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
AsyncButton = require './async-button'

{PerformanceExportStore, PerformanceExportActions} = require '../../flux/performance-export'

module.exports = React.createClass
  displayName: 'ExportPerformance'

  mixins: [BindStoreMixin]
  bindStore: PerformanceExportStore

  getInitialState: ->
    downloadUrl: null

  updateDownloadUrl: (exportData) ->
    if exportData.exportFor is @props.courseId
      @setState({downloadUrl: exportData.url})

  addBindListener: ->
    PerformanceExportStore.on('performanceExport.completed', @updateDownloadUrl)

  removeBindListener: ->
    PerformanceExportStore.off('performanceExport.completed', @updateDownloadUrl)

  render: ->
    {courseId, className} = @props
    {downloadUrl} = @state

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

    <span className={className}>
      {exportButton}
      {downloadLink}
    </span>
