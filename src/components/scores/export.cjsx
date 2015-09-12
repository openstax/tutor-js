BS = require 'react-bootstrap'
React = require 'react'
mime = require 'mime-types'

BindStoreMixin = require '../bind-store-mixin'
AsyncButton = require '../buttons/async-button'
TimeDifference = require '../time-difference'

{ScoresExportStore, ScoresExportActions} = require '../../flux/scores-export'

ScoresExport = React.createClass
  displayName: 'ScoresExport'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    className: React.PropTypes.string

  mixins: [BindStoreMixin]
  bindStore: ScoresExportStore

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
    ScoresExportActions.load(courseId)

  componentDidUpdate: (prevProps, prevState) ->
    @setState(forceDownloadUrl: @state.downloadUrl) if @shouldTriggerDownload(prevState, @state)

  shouldTriggerDownload: (prevState, currentState) ->
    prevState.tryToDownload and not currentState.tryToDownload and not currentState.downloadHasError and currentState.downloadUrl?

  handleCompletedExport: (exportData) ->
    {courseId} = @props
    if @isUpdateValid(exportData.for)
      ScoresExportActions.load(courseId)
      @setState(tryToDownload: true)

  handleLoadedExport: (id) ->
    if @isUpdateValid(id)
      lastExport = ScoresExportStore.getLatestExport(id)
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
    {courseId} = @props
    ScoresExportStore.on("progress.#{courseId}.completed", @handleCompletedExport)
    ScoresExportStore.on('loaded', @handleLoadedExport)

  removeBindListener: ->
    {courseId} = @props
    ScoresExportStore.off("progress.#{courseId}.completed", @handleCompletedExport)
    ScoresExportStore.off('loaded', @handleLoadedExport)

  render: ->
    {courseId, className} = @props
    {downloadUrl, lastExported, downloadedSinceLoad, downloadHasError, tryToDownload, forceDownloadUrl} = @state

    className += ' export-button'
    actionButtonClass = 'primary'
    actionButtonClass = 'default' if downloadedSinceLoad

    failedProps =
      beforeText: 'There was a problem exporting. '

    actionButton =
      <AsyncButton
        bsStyle={actionButtonClass}
        onClick={-> ScoresExportActions.export(courseId)}
        isWaiting={ScoresExportStore.isExporting(courseId) or tryToDownload}
        isFailed={ScoresExportStore.isFailed(courseId) or downloadHasError}
        failedProps={failedProps}
        isJob={true}
        waitingText='Generating Export…'>
        Generate Export
      </AsyncButton>

    if forceDownloadUrl?
      actionButton =
        <BS.Button
          bsStyle={actionButtonClass}
          href={forceDownloadUrl}
          onClick={@downloadCurrentExport}>Download Export</BS.Button>

    if lastExported? and not downloadHasError
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

module.exports = ScoresExport
