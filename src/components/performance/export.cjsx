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
    forceDownloadUrl: null
    lastExported: null
    tryToDownload: false
    downloadedSinceLoad: false
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
      downloadHasError: true
      forceDownloadUrl: null

    invalidDownloadState.downloadUrl = null if @state.downloadUrl is downloadUrl

    @setState(invalidDownloadState)

  triggerDownload: ({downloadUrl, lastExported}) ->
    downloadState =
      tryToDownload: false
      downloadUrl: downloadUrl
      lastExported: lastExported
      forceDownloadUrl: null

    @setState(downloadState)

  downloadCurrentExport: ->
    @setState(tryToDownload: true, downloadedSinceLoad: true)

  addBindListener: ->
    PerformanceExportStore.on('performanceExport.completed', @handleCompletedExport)
    PerformanceExportStore.on('performanceExport.loaded', @handleLoadedExport)

  removeBindListener: ->
    PerformanceExportStore.off('performanceExport.completed', @handleCompletedExport)
    PerformanceExportStore.off('performanceExport.loaded', @handleLoadedExport)

  render: ->
    {courseId, className} = @props
    {downloadUrl, lastExported, downloadedSinceLoad, downloadHasError, tryToDownload, forceDownloadUrl} = @state

    className += ' export-button'
    actionButtonClass = 'primary'
    actionButtonClass = 'default' if downloadedSinceLoad

    actionButton =
      <AsyncButton
        bsStyle={actionButtonClass}
        onClick={-> PerformanceExportActions.export(courseId)}
        isWaiting={PerformanceExportStore.isExporting(courseId) or tryToDownload}
        isFailed={PerformanceExportStore.isFailed(courseId) or downloadHasError}
        waitingText='Generating Export…'>
        Generate Export
      </AsyncButton>

    if forceDownloadUrl?
      actionButton =
        <BS.Button
          bsStyle={actionButtonClass}
          href={forceDownloadUrl}
          onClick={@downloadCurrentExport}>Download Export</BS.Button>

    if lastExported?
      lastExportedTime = <i>
        <TimeDifference date={lastExported}/>
      </i>
      lastExportedLabel = <small className='export-button-time pull-right'>
        Last exported {lastExportedTime}
      </small>

    <span className={className}>
      <div className='export-button-buttons'>
        {actionButton}
      </div>
      {lastExportedLabel}
    </span>

module.exports = PerformanceExport
