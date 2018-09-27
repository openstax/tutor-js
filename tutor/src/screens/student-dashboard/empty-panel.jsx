import { React, cn, observer, inject } from '../../helpers/react';
import { Panel } from 'react-bootstrap';
import Icon from '../../components/icon';

const EmptyPanel = inject('studentDashboardUX')(observer(({
  studentDashboardUX,
  message,
  title,
  className,
}) => {

  if (studentDashboardUX && studentDashboardUX.isPendingTaskLoading) {
    return (
      <Panel className={cn('empty', 'pending', className)} header={title}>
        <Icon type="spinner" spin /> Preparing assignments for your course.  This
        can take up to 10 minutes.
      </Panel>
    );
  }

  return (
    <Panel className={cn('empty', className)} header={title}>
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
