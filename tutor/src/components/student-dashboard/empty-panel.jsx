import React from 'react';
import { Panel } from 'react-bootstrap';
import StudentTasks from '../../models/student-tasks';
import Icon from '../icon';

const EmptyPanel = ({ courseId, message, title }) => {

  if (StudentTasks.get(courseId).isFetchingInitialUpdates) {
    return (
      <Panel className="empty" header={title}>
        <Icon type="spinner" spin />  Loading assignments for course
      </Panel>
    );
  }

  return (
    <Panel className="empty" header={title}>
      {message}
    </Panel>
  );
};

EmptyPanel.propTypes = {
  courseId: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
};

export default EmptyPanel;
