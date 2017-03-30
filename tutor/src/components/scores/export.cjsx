BS = require 'react-bootstrap'
React = require 'react'
mime = require 'mime-types'
classnames = require 'classnames'

BindStoreMixin = require '../bind-store-mixin'
{AsyncButton} = require 'shared'
TimeDifference = require '../time-difference'
{default: TourAnchor} = require '../tours/anchor'

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
    finalDownloadUrl: null
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
    @setState(finalDownloadUrl: @state.downloadUrl) if @shouldTriggerDownload(prevState, @state)

  shouldTriggerDownload: (prevState, currentState) ->
    prevState.tryToDownload and
      not currentState.tryToDownload and
      not currentState.downloadHasError and
      currentState.downloadUrl?

  handleCompletedExport: (exportData) ->
    {courseId} = @props
    if @isUpdateValid(exportData.for)
      ScoresExportActions.load(courseId)
      @setState(tryToDownload: true)

  handleExportProgress: (progressData) ->
    {courseId} = @props
    @setState(downloadHasError: true) if ScoresExportStore.isFailed(courseId)

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
      finalDownloadUrl: null

    invalidDownloadState.downloadUrl = null if @state.downloadUrl is downloadUrl

    @setState(invalidDownloadState)

  triggerDownload: ({downloadUrl, lastExported}) ->
    downloadState =
      tryToDownload: false
      downloadUrl: downloadUrl
      lastExported: lastExported
      finalDownloadUrl: null

    @setState(downloadState)

  addBindListener: ->
    {courseId} = @props
    ScoresExportStore.on("progress.#{courseId}.succeeded", @handleCompletedExport)
    ScoresExportStore.on("progress.#{courseId}.*", @handleExportProgress)
    ScoresExportStore.on('loaded', @handleLoadedExport)

  removeBindListener: ->
    {courseId} = @props
    ScoresExportStore.off("progress.#{courseId}.succeeded", @handleCompletedExport)
    ScoresExportStore.off("progress.#{courseId}.*", @handleExportProgress)
    ScoresExportStore.off('loaded', @handleLoadedExport)

  render: ->
    {courseId, className} = @props
    {downloadUrl, lastExported, downloadHasError, tryToDownload, finalDownloadUrl} = @state
    isWorking = ScoresExportStore.isExporting(courseId) or tryToDownload

    classes = classnames 'export-button', className
    actionButtonClass = 'primary'

    failedProps =
      beforeText: 'There was a problem exporting. '

    actionButton =
      <AsyncButton
        bsStyle={actionButtonClass}
        onClick={-> ScoresExportActions.export(courseId)}
        isWaiting={isWorking}
        isFailed={ScoresExportStore.isFailed(courseId) or downloadHasError}
        failedProps={failedProps}
        isJob={true}
        timeoutLength={3600000}
        waitingText='Generating Export…'>
        Export
      </AsyncButton>

    if isWorking
      exportTimeNotice =
        <i><small>The export may take up to 10 minutes.</small></i>

    <TourAnchor className={classes} id="scores-export-button">
      <div className='export-button-buttons'>
        {actionButton}
      </div>
      {exportTimeNotice}
      <iframe id="downloadExport" src={finalDownloadUrl}></iframe>
    </TourAnchor>

module.exports = ScoresExport
