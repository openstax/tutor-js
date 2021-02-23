import React from 'react';
import NoStudents from '../../components/plan-stats/no-students';
import PropTypes from 'prop-types';
import CGL from '../../components/course-grouping-label';

const NoStats = ({ header, course, period }) => {

  const body = period.hasEnrollments ? (
    <p>
      No activity has been recorded for this <CGL lowercase courseId={course.id} /> yet.  Once students start to work the assignment their activity wil appear.
    </p>
  ) : (
    <NoStudents courseId={course.id} />
  );

  return (
    <div className="task-teacher-review no-stats">
      {header}
      <h1>No activity yet</h1>
      {body}
    </div>
  );
};

NoStats.propTypes = {
  course: PropTypes.any,
  period: PropTypes.any,
  header: PropTypes.any,
}

export default NoStats;
