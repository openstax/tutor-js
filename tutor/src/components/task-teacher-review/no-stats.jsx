import React from 'react';
import NoStudents from '../plan-stats/no-students';
import CGL from '../course-grouping-label';
import LoadingScreen from 'shared/components/loading-animation';

// eslint-disable-next-line
const NoStats = ({ taskPlan, header, course, period }) => {
  if (!taskPlan.analytics.api.hasBeenFetched) {
    return <LoadingScreen />;
  }

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


export default NoStats;
