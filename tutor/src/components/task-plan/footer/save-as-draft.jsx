import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';
import { AsyncButton, OXLink } from 'shared';

export default class SaveAsDraft extends React.Component {

  static propTypes = {
    onClick:      PropTypes.func.isRequired,
    isWaiting:    PropTypes.bool.isRequired,
    isFailed:     PropTypes.bool.isRequired,
    hasError:     PropTypes.bool.isRequired,
    isPublished:  PropTypes.bool.isRequired,
    isPublishing: PropTypes.bool.isRequired,
  }

  render() {
    if (this.props.isPublished) { return null; }

    const additionalProps = OXLink.filterProps(
      omit(this.props, 'onSave', 'onPublish', 'isEditable', 'isSaving', 'isWaiting', 'isPublished', 'isPublishing', 'hasError')
      , { prefixes: 'bs' });

    return (
      <AsyncButton
        className="-save save"
        onClick={this.props.onClick}
        variant="secondary"
        isWaiting={this.props.isWaiting}
        isFailed={this.props.isFailed}
        waitingText="Saving…"
        disabled={this.props.hasError || this.props.isWaiting || this.props.isPublishing}
        {...additionalProps}>
        Save as Draft
      </AsyncButton>
    );
  }
}
