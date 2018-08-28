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

  if (studentDashboardUX && studentDashboardUX.isEmptyNewStudent) {
    return (
      <Panel className="empty" header={title}>
        <Icon type="spinner" spin /> Preparing assignments for your course.  This
        will take about {moment.duration(studentDashboardUX.fetchTasksInterval, 'ms').humanize()}.
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
    isEmptyNewStudent: React.PropTypes.bool,
  }),
  message: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
};

export default EmptyPanel;
