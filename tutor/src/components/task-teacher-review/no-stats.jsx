import React from 'react';
import NoStudents from '../plan-stats/no-students';
import CGL from '../course-grouping-label';
import LoadingScreen from 'shared/components/loading-animation';
import { PinnedHeaderFooterCard } from 'shared';

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
    <PinnedHeaderFooterCard
      className="task-teacher-review no-stats"
      fixedOffset={0}
      header={header}
      cardType="task"
    >
      <h1>No activity yet</h1>
      {body}
    </PinnedHeaderFooterCard>
  );
};


export default NoStats;
