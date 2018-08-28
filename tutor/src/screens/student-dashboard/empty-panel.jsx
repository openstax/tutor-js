import React from 'react';
import { observer, inject } from 'mobx-react';
import { Panel } from 'react-bootstrap';
import moment from 'moment';
import StudentTasks from '../../models/student-tasks';
import Icon from '../../components/icon';

const EmptyPanel = inject('studentDashboardUX')(observer(({
  studentDashboardUX,
  message,
  title,
}) => {

  if (studentDashboardUX && studentDashboardUX.isPendingTaskLoading) {
    return (
      <Panel className="empty" header={title}>
        <Icon type="spinner" spin /> Preparing assignments for your course.  This
        can take up to 10 minutes.
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
    isPendingTaskLoading: React.PropTypes.bool,
  }),
  message: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
};

export default EmptyPanel;
