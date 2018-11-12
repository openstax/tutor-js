import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';

export default class CancelButton extends React.Component {

  static propTypes = {
    onClick:    PropTypes.func.isRequired,
    isWaiting:  PropTypes.bool.isRequired,
    isEditable: PropTypes.bool.isRequired,
  }

  render() {
    if (!this.props.isEditable) { return null; }

    return (
      <Button
        variant="default"
        disabled={this.props.isWaiting}
        onClick={this.props.onClick}
      >
        Cancel
      </Button>
    );
  }
}
