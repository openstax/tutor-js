import PropTypes from 'prop-types';
import React from 'react';
import { omit } from 'lodash';

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


export default class SaveTaskButton extends React.Component {

  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    isEditable:   PropTypes.bool.isRequired,
    isSaving:     PropTypes.bool.isRequired,
    isWaiting:    PropTypes.bool.isRequired,
    isPublished:  PropTypes.bool.isRequired,
    isPublishing: PropTypes.bool.isRequired,
    hasError:     PropTypes.bool.isRequired,
    isFailed:     PropTypes.bool.isRequired,
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
        variant="primary"
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
