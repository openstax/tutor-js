import React from 'react';
import CourseGroupingLabel from '../course-grouping-label';
import TutorLink from '../link';

const NoStudents = ({ courseId }) =>
  <div className="no-students">
    <p>
      No students enrolled. This assignment will automatically be given to students in
      this <CourseGroupingLabel courseId={courseId} lowercase={true} /> when they enroll.
      Manage student enrollment
      in <TutorLink to="courseSettings" params={{ courseId }}>Course settings</TutorLink>.
    </p>
  </div>
;

NoStudents.displayName = 'NoStudents';
export default NoStudents;
