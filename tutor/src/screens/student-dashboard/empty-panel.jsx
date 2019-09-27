import { React, cn, observer } from 'vendor';
import Course from '../../models/course';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Icon } from 'shared';

const EmptyCard = observer(({
  course,
  message,
  spinner,
  tasks,
  title,
  className,
}) => {
  const { studentTaskPlans } = course;

  if (spinner) {
    if (studentTaskPlans.isPendingTaskLoading) {
      return (
        <Card className={cn('empty', 'pending', className)} header={title}>
          <Icon variant="activity" /> Preparing assignments for your course.  This
          can take up to 10 minutes.
        </Card>
      );
    }

    if (studentTaskPlans.api.isPendingInitialFetch) {
      return (
        <Card className={cn('empty', 'pending', className)} header={title}>
          <Icon variant="activity" /> Fetching assignments for your course.
        </Card>
      );
    }
  }

  if (isEmpty(tasks) && message) {
    return (
      <Card className={cn('empty', className)} header={title}>
        {message}
      </Card>
    );
  }

  return null;
});

EmptyCard.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
  message: PropTypes.string,
  title: PropTypes.string,
};

export default EmptyCard;
