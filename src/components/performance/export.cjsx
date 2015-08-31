BS = require 'react-bootstrap'
React = require 'react'
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
    forceDownloadUrl: null
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

  componentDidUpdate: (prevProps, prevState) ->
    @setState(forceDownloadUrl: @state.downloadUrl) if @shouldTriggerDownload(prevState, @state)

  shouldTriggerDownload: (prevState, currentState) ->
    prevState.tryToDownload and not currentState.tryToDownload and not currentState.downloadHasError and currentState.downloadUrl?

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

    cancelDownload = @cancelDownload.bind(@, {downloadUrl, lastExported})
    triggerDownload = @triggerDownload.bind(@, {downloadUrl, lastExported})

    downloadUrlChecker.onreadystatechange = =>
      # when response received...
      if downloadUrlChecker.readyState is 2
        contentType = downloadUrlChecker.getResponseHeader('Content-Type') if @isRequestOK(downloadUrlChecker)
        # Check for whether the return contentType from the header
        # matches the expected type.
        if contentType is mime.contentType('.xlsx')
          triggerDownload()
        else
          cancelDownload()

    downloadUrlChecker.onabort = cancelDownload
    downloadUrlChecker.onerror = cancelDownload
    downloadUrlChecker.timeout = cancelDownload

    downloadUrlChecker.send()

  cancelDownload: ({downloadUrl}) ->
    invalidDownloadState =
      tryToDownload: false
      exportedSinceLoad: true
      downloadHasError: true
      forceDownloadUrl: null

    invalidDownloadState.downloadUrl = null if @state.downloadUrl is downloadUrl

    @setState(invalidDownloadState)

  triggerDownload: ({downloadUrl, lastExported}) ->
    downloadState =
      tryToDownload: false
      exportedSinceLoad: true
      downloadUrl: downloadUrl
      lastExported: lastExported
      forceDownloadUrl: null

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
    {downloadUrl, lastExported, exportedSinceLoad, downloadHasError, tryToDownload, forceDownloadUrl} = @state

    className += ' export-button'
    exportClass = 'primary'
    exportClass = 'default' if exportedSinceLoad

    failedProps =
      beforeText: 'There was a problem exporting. '

    exportButton =
      <AsyncButton
        bsStyle={exportClass}
        onClick={-> PerformanceExportActions.export(courseId)}
        isWaiting={PerformanceExportStore.isExporting(courseId) or tryToDownload}
        isFailed={PerformanceExportStore.isFailed(courseId) or downloadHasError}
        failedProps={failedProps}
        waitingText='Exporting…'>
        Export
      </AsyncButton>

    if lastExported? and not downloadHasError
      lastExportedTime = <i>
        <TimeDifference date={lastExported}/>
      </i>
      
      if downloadUrl?
        lastExportedTime = <a onClick={@downloadCurrentExport} href='#'>
          Download export from {lastExportedTime}
        </a>
      else
        lastExportedTime = "Last exported #{lastExportedTime}"

      lastExportedLabel = <small className='export-button-time pull-right'>
        {lastExportedTime}
      </small>

    <span className={className}>
      <div className='export-button-buttons'>
        {exportButton}
      </div>
      <iframe
        ref='downloader'
        className='tutor-downloader'
        frameBorder={0}
        src={forceDownloadUrl}/>
      {lastExportedLabel}
    </span>

module.exports = PerformanceExport
