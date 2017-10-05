const NoStudents = ({courseId}) =>
  <div className="no-students">
    <p>
      No students enrolled. This assignment will automatically be given to students in
      this <CourseGroupingLabel courseId={courseId} lowercase={true} /> when they enroll.
      Manage student enrollment
      in <TutorLink to="courseSettings" params={{ courseId }}>Settings</TutorLink>.
    </p>
  </div>
;

NoStudents.displayName = 'NoStudents';
export default NoStudents;
