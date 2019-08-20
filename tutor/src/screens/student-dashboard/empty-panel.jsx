import { React, cn, observer } from '../../helpers/react';
import Course from '../../models/course';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Icon } from 'shared';

const EmptyCard = observer(({
  course,
  message,
  title,
  className,
}) => {
  const { studentTaskPlans } = course;

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

  return (
    <Card className={cn('empty', className)} header={title}>
      {message}
    </Card>
  );
});

EmptyCard.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default EmptyCard;
