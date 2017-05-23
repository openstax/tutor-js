import React from 'react';
import { AsyncButton, SuretyGuard } from 'shared';
import Icon from '../../icon';

export default class DeleteLink extends React.PureComponent {

  static propTypes = {
    onClick:     React.PropTypes.func.isRequired,
    isWaiting:   React.PropTypes.bool.isRequired,
    isFailed:    React.PropTypes.bool.isRequired,
    isNew:       React.PropTypes.bool.isRequired,
    isVisibleToStudents: React.PropTypes.bool.isRequired,
  }

  render() {
    if (this.props.isNew && !this.props.isWaiting) { return null; }

    let message = 'Are you sure you want to delete this assignment?';

    if (this.props.isVisibleToStudents) {
      message = `Some students may have started work on this assignment. ${message}`;
    }

    return (
      <SuretyGuard
        onConfirm={this.props.onClick}
        okButtonLabel="Yes"
        placement="top"
        message={message}>
        <AsyncButton
          className="delete-link pull-right"
          isWaiting={this.props.isWaiting}
          isFailed={this.props.isFailed}
          waitingText="Deleting…">
          <Icon type="trash" />
          Delete Assignment
        </AsyncButton>
      </SuretyGuard>
    );
  }

}
