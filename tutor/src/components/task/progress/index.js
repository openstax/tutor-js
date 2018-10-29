import React from 'react';
import PropTypes from 'prop-types';
import { TaskCardStore } from '../../../flux/task-panel';
import { ProgressBar } from 'react-bootstrap';

export default
function Progress(props) {
  const progress = TaskCardStore.getProgress(props.taskId, props.stepIndex);
  return (
    <div className="reading-task-bar">
      <ProgressBar now={progress} variant="success" />
    </div>
  );
}

Progress.propTypes = {
  taskId: PropTypes.string,
  stepIndex: PropTypes.number,
};
