import React from 'react';
import { Button } from 'react-bootstrap';
import Icon from '../../icon';

export default class PreviewButton extends React.PureComponent {

  static propTypes = {
    courseId:   React.PropTypes.string.isRequired,
    isWaiting:  React.PropTypes.bool.isRequired,
    isNew:      React.PropTypes.bool.isRequired,
  }

  render() {
    if (!this.props.isNew || this.props.isWaiting) { return null; }

    return (
      <Button className="preview-btn pull-right">
        <Icon type="video-camera" />
        What do students see?
      </Button>
    );
  }
}
