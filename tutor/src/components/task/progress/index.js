import PropTypes from 'prop-types';
import React from 'react';
import { TaskPanelStore } from '../../../flux/task-panel';
import BS from 'react-bootstrap';

export default class extends React.Component {
  static propTypes = {
    taskId: PropTypes.string,
    stepIndex: PropTypes.number,
  };

  render() {
    const progress = TaskPanelStore.getProgress(this.props.taskId, this.props.stepIndex);
    return (
      <div className="reading-task-bar">
        <BS.ProgressBar now={progress} bsStyle="success" />
      </div>
    );
  }
}
