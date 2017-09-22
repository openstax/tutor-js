import React from 'react';
import mime from 'mime-types';
import classnames from 'classnames';
import { observable } from 'mobx';
import BindStoreMixin from '../bind-store-mixin';
import { AsyncButton } from 'shared';
import TourAnchor from '../tours/anchor';

import { ScoresExportStore, ScoresExportActions } from '../../flux/scores-export';

export default class ScoresExport extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      downloadUrl: null,
      finalDownloadUrl: null,
      lastExported: null,
      tryToDownload: false,
      downloadedSinceLoad: false,
      downloadHasError: false,
    };
  }

  isUpdateValid(id) {
    const { courseId } = this.props;
    return id === courseId;
  }

  componentWillMount() {
    const { courseId } = this.props;
    ScoresExportActions.load(courseId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldTriggerDownload(prevState, this.state)) {
      this.setState({ finalDownloadUrl: this.state.downloadUrl });
    }
  }

  shouldTriggerDownload(prevState, currentState) {
    return Boolean(
      prevState.tryToDownload &&
      !currentState.tryToDownload &&
      !currentState.downloadHasError &&
      (currentState.downloadUrl != null)
    );
  }

  handleCompletedExport(exportData) {
    const { courseId } = this.props;
    if (this.isUpdateValid(exportData.for)) {
      ScoresExportActions.load(courseId);
      this.setState({ tryToDownload: true });
    }
  }

  handleExportProgress() {
    const { courseId } = this.props;
    if (ScoresExportStore.isFailed(courseId)) {
      this.setState({ downloadHasError: true });
    }
  }

  handleLoadedExport(id) {
    if (this.isUpdateValid(id)) {
      const lastExport = ScoresExportStore.getLatestExport(id);
      if (lastExport == null) { return; }

      const exportState = {
        downloadUrl: lastExport.url,
        lastExported: lastExport.created_at,
      };

      if (this.state.tryToDownload) {
        this.validateDownloadURL(exportState);
      } else {
        this.setState(exportState);
      }
    }
  }

  isRequestOK(request) {
    return (
      (request.status === 200) && (request.statusText === 'OK')
    );
  }

  validateDownloadURL({ downloadUrl, lastExported }) {
    const downloadUrlChecker = new XMLHttpRequest();
    downloadUrlChecker.open('GET', downloadUrl, true);

    const cancelDownload = this.cancelDownload.bind(this, { downloadUrl, lastExported });
    const triggerDownload = this.triggerDownload.bind(this, { downloadUrl, lastExported });

    downloadUrlChecker.onreadystatechange = () => {
      // when response received...
      if (downloadUrlChecker.readyState === 2) {
        let contentType;
        if (this.isRequestOK(downloadUrlChecker)) { contentType = downloadUrlChecker.getResponseHeader('Content-Type'); }
        // Check for whether the return contentType from the header
        // matches the expected type.
        if (contentType === mime.contentType('.xlsx')) {
          triggerDownload()
        } else {
          cancelDownload()
        }
      }
    };

    downloadUrlChecker.onabort = cancelDownload;
    downloadUrlChecker.onerror = cancelDownload;
    downloadUrlChecker.timeout = cancelDownload;

    downloadUrlChecker.send();
  }

  cancelDownload({ downloadUrl }) {
    const invalidDownloadState = {
      tryToDownload: false,
      downloadHasError: true,
      finalDownloadUrl: null,
    };
    if (this.state.downloadUrl === downloadUrl) { invalidDownloadState.downloadUrl = null; }
    this.setState(invalidDownloadState);
  }

  triggerDownload({ downloadUrl, lastExported }) {
    const downloadState = {
      tryToDownload: false,
      downloadUrl,
      lastExported,
      finalDownloadUrl: null,
    };
    this.setState(downloadState);
  }

  addBindListener() {
    const { courseId } = this.props;
    ScoresExportStore.on(`progress.${courseId}.succeeded`, this.handleCompletedExport);
    ScoresExportStore.on(`progress.${courseId}.*`, this.handleExportProgress);
    ScoresExportStore.on('loaded', this.handleLoadedExport);
  }

  removeBindListener() {
    const { courseId } = this.props;
    ScoresExportStore.off(`progress.${courseId}.succeeded`, this.handleCompletedExport);
    ScoresExportStore.off(`progress.${courseId}.*`, this.handleExportProgress);
    ScoresExportStore.off('loaded', this.handleLoadedExport);
  }

  render() {
    let exportTimeNotice;
    const { courseId, className } = this.props;
    const { downloadHasError, tryToDownload, finalDownloadUrl } = this.state;
    const isWorking = ScoresExportStore.isExporting(courseId) || tryToDownload;

    const classes = classnames('export-button', className);
    const actionButtonClass = 'primary';

    const failedProps =
      { beforeText: 'There was a problem exporting. ' };

    const actionButton =
      <AsyncButton
        bsStyle={actionButtonClass}
        onClick={function() { return ScoresExportActions.export(courseId); }}
        isWaiting={isWorking}
        isFailed={ScoresExportStore.isFailed(courseId) || downloadHasError}
        failedProps={failedProps}
        isJob={true}
        timeoutLength={3600000}
        waitingText="Generating Export…"
      >
        Export
      </AsyncButton>;

    if (isWorking) {
      exportTimeNotice =
        <i>
          <small>
            The export may take up to 10 minutes.
          </small>
        </i>;
    }

    return (
      <TourAnchor className={classes} id="scores-export-button">
        <div className="export-button-buttons">
          {actionButton}
        </div>
        {exportTimeNotice}
        <iframe id="downloadExport" src={finalDownloadUrl} />
      </TourAnchor>
    );
  }

}
