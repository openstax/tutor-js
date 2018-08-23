import React from 'react';
import { observer, inject } from 'mobx-react';
import { Panel } from 'react-bootstrap';
import StudentTasks from '../../models/student-tasks';
import Icon from '../../components/icon';

const EmptyPanel = inject('studentDashboardUX')(observer(({
  studentDashboardUX,
  message,
  title,
}) => {

  if (studentDashboardUX && studentDashboardUX.shouldFastPoll) {
    return (
      <Panel className="empty" header={title}>
        <Icon type="spinner" spin /> Loading assignments for course
      </Panel>
    );
  }

  return (
    <Panel className="empty" header={title}>
      {message}
    </Panel>
  );
}));

EmptyPanel.propTypes = {
  studentDashboardUX: React.PropTypes.shape({
    shouldFastPoll: React.PropTypes.bool,
  }),
  message: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
};

export default EmptyPanel;
