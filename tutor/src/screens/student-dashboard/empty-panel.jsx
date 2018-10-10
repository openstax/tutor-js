import { React, cn, observer } from '../../helpers/react';
import Course from '../../models/course';
import { Panel } from 'react-bootstrap';
import Icon from '../../components/icon';

const EmptyPanel = observer(({
  course,
  message,
  title,
  className,
}) => {
  const { studentTasks } = course;

  if (studentTasks.isPendingTaskLoading) {
    return (
      <Panel className={cn('empty', 'pending', className)} header={title}>
        <Icon type="spinner" spin /> Preparing assignments for your course.  This
        can take up to 10 minutes.
      </Panel>
    );
  }
  if (studentTasks.api.isPending) {
    return (
      <Panel className={cn('empty', 'pending', className)} header={title}>
        <Icon type="spinner" spin /> Fetching assignments for your course.
      </Panel>
    );
  }

  return (
    <Panel className={cn('empty', className)} header={title}>
      {message}
    </Panel>
  );
});

EmptyPanel.propTypes = {
  course: React.PropTypes.instanceOf(Course).isRequired,
  message: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
};

export default EmptyPanel;
