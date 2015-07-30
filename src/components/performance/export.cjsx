BS = require 'react-bootstrap'
React = require 'react'
moment = require 'moment'
mime = require 'mime-types'

BindStoreMixin = require '../bind-store-mixin'
AsyncButton = require '../buttons/async-button'
TimeDifference = require '../time-difference'

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
    tryToDownload: false
    exportedSinceLoad: false
    downloadHasError: false

  isUpdateValid: (id) ->
    {courseId} = @props
    id is courseId

  componentWillMount: ->
    {courseId} = @props
    PerformanceExportActions.load(courseId)

  componentWillUpdate: (nextProps, nextState) ->
    window.location = nextState.downloadUrl if @shouldTriggerDownload(@state, nextState)

  shouldTriggerDownload: (currentState, nextState) ->
    currentState.tryToDownload and not nextState.tryToDownload and not nextState.downloadHasError and nextState.downloadUrl?

  handleCompletedExport: (exportData) ->
    {courseId} = @props
    if @isUpdateValid(exportData.exportFor)
      PerformanceExportActions.load(courseId)
      @setState(tryToDownload: true)

  handleLoadedExport: (id) ->
    if @isUpdateValid(id)
      lastExport = PerformanceExportStore.getLatestExport(id)
      return unless lastExport?

      exportState =
        downloadUrl: lastExport.url
        lastExported: lastExport.created_at

      if @state.tryToDownload
        @validateDownloadURL(exportState)
      else
        @setState(exportState)

  isRequestOK: (request) ->
    request.status is 200 and request.statusText is 'OK'

  validateDownloadURL: ({downloadUrl, lastExported}) ->
    downloadUrlChecker = new XMLHttpRequest()
    downloadUrlChecker.open('GET', downloadUrl, true)

    downloadUrlChecker.onreadystatechange = =>
      # when response received...
      if downloadUrlChecker.readyState is 4
        contentType = downloadUrlChecker.getResponseHeader('Content-Type') if @isRequestOK(downloadUrlChecker)
        # Check for whether the return contentType from the header
        # matches the expected type.
        if contentType is mime.contentType('.xlsx')
          @triggerDownload({downloadUrl, lastExported})
        else
          @cancelDownload({downloadUrl, lastExported})

    downloadUrlChecker.send()

  cancelDownload: ({downloadUrl}) ->
    invalidDownloadState =
      tryToDownload: false
      exportedSinceLoad: true
      downloadHasError: true

    invalidDownloadState.downloadUrl = null if @state.downloadUrl is downloadUrl

    @setState(invalidDownloadState)

  triggerDownload: ({downloadUrl, lastExported}) ->
    downloadState =
      tryToDownload: false
      exportedSinceLoad: true
      downloadUrl: downloadUrl
      lastExported: lastExported

    @setState(downloadState)

  downloadCurrentExport: (linkClickEvent) ->
    linkClickEvent.preventDefault()
    @setState(tryToDownload: true)
    @validateDownloadURL(@state)

  addBindListener: ->
    PerformanceExportStore.on('performanceExport.completed', @handleCompletedExport)
    PerformanceExportStore.on('performanceExport.loaded', @handleLoadedExport)

  removeBindListener: ->
    PerformanceExportStore.off('performanceExport.completed', @handleCompletedExport)
    PerformanceExportStore.off('performanceExport.loaded', @handleLoadedExport)

  render: ->
    {courseId, className} = @props
    {downloadUrl, lastExported, exportedSinceLoad, downloadHasError, tryToDownload} = @state

    className += ' export-button'
    exportClass = 'primary'
    exportClass = 'default' if exportedSinceLoad

    exportButton =
      <AsyncButton
        bsStyle={exportClass}
        onClick={-> PerformanceExportActions.export(courseId)}
        isWaiting={PerformanceExportStore.isExporting(courseId) or tryToDownload}
        isFailed={PerformanceExportStore.isFailed(courseId) or downloadHasError}
        waitingText='Exporting…'>
        Export
      </AsyncButton>

    if lastExported?
      lastExportedTime = <i>
        <TimeDifference date={lastExported}/>
      </i>
      lastExportedTime = <a onClick={@downloadCurrentExport} href='#'>
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
