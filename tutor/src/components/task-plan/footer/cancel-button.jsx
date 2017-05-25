import React from 'react';
import { Button } from 'react-bootstrap';

export default class CancelButton extends React.PureComponent {

  static propTypes = {
    onClick:    React.PropTypes.func.isRequired,
    isWaiting:  React.PropTypes.bool.isRequired,
    isEditable: React.PropTypes.bool.isRequired,
  }

  render() {
    if (!this.props.isEditable) { return null; }

    return (
      <Button disabled={this.props.isWaiting} onClick={this.props.onClick}>
        Cancel
      </Button>
    );
  }
}
