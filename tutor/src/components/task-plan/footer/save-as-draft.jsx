import React from 'react';
import omit from 'lodash/omit';
import { AsyncButton, OXLink } from 'shared';

export default class SaveAsDraft extends React.PureComponent {

  static propTypes = {
    onClick:      React.PropTypes.func.isRequired,
    isWaiting:    React.PropTypes.bool.isRequired,
    isFailed:     React.PropTypes.bool.isRequired,
    hasError:     React.PropTypes.bool.isRequired,
    isPublished:  React.PropTypes.bool.isRequired,
    isPublishing: React.PropTypes.bool.isRequired,
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
