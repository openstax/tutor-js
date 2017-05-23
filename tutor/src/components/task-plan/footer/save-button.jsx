import React from 'react';
import BS from 'react-bootstrap';
import omit from 'lodash/omit';

import { AsyncButton, OXLink } from 'shared';

const MESSAGES = {

  publish: {
    action: 'Publish',
    waiting: 'Publishing…',
  },

  save: {
    action: 'Save',
    waiting: 'Saving…',
  },
};


export default class TaskSaveButton extends React.PureComponent {

  static propTypes = {
    onSave: React.PropTypes.func.isRequired,
    onPublish: React.PropTypes.func.isRequired,
    isEditable:   React.PropTypes.bool.isRequired,
    isSaving:     React.PropTypes.bool.isRequired,
    isWaiting:    React.PropTypes.bool.isRequired,
    isPublished:  React.PropTypes.bool.isRequired,
    isPublishing: React.PropTypes.bool.isRequired,
    hasError:     React.PropTypes.bool.isRequired,
    isFailed:     React.PropTypes.bool.isRequired,
  }

  render() {
    if (!this.props.isEditable) { return null; }

    const { isPublished } = this.props;

    const isBusy = isPublished ?
      this.props.isWaiting && (this.props.isSaving || this.props.isPublishing)
    :
      this.props.isWaiting && this.props.isPublishing;

    const Text = isPublished ? MESSAGES.save : MESSAGES.publish;

    const additionalProps = OXLink.filterProps(
      omit(this.props, 'onSave', 'onPublish', 'isEditable', 'isSaving', 'isWaiting', 'isPublished', 'isPublishing', 'hasError')
    , { prefixes: 'bs' });

    return (
      <AsyncButton
        isJob={true}
        bsStyle="primary"
        className="-publish publish"
        onClick={isPublished ? this.props.onSave : this.props.onPublish}
        waitingText={Text.waiting}
        isFailed={this.props.isFailed}
        disabled={this.props.hasError || this.props.isWaiting || this.props.isSaving}
        isWaiting={isBusy}
        {...additionalProps}>
        {Text.action}
      </AsyncButton>
    );
  }
}
