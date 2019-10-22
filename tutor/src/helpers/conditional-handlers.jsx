import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { extend } from 'lodash';
import { asyncComponent } from './async-component';
import { CourseNotFoundWarning } from '../components/course-not-found-warning';
import Courses from '../models/courses-map';
import { OXMatchByRouter } from 'shared';

const StudentDashboard = asyncComponent(
  () => import('../screens/student-dashboard'),
  'Student Dashboard',
);

const TeacherDashboard = asyncComponent(
  () => import('../screens/teacher-dashboard'),
  'Teacher Dashboard',
);

const getConditionalHandlers = (Router) => {
  const MatchForTutor = OXMatchByRouter(Router, null, 'TutorRouterMatch');

  const renderDashboard = (props) => {
    const { courseId } = props.params;

    extend(props, { courseId });
    const course = Courses.get(courseId);
    if (!course) {
      return <CourseNotFoundWarning />;
    }

    if (!props.match.isExact) {
      return (
        <MatchForTutor {...props} />
      );
    }

    if (course.currentRole.isTeacher) {
      return <TeacherDashboard {...props} />;
    } else {
      return <StudentDashboard {...props} />;
    }
  };


  // eslint-disable-next-line react/prop-types
  const renderBecomeRole = ({ params: { courseId, roleId } }) => {
    const location = useLocation();
    const course = Courses.get(courseId);
    if (!course) { return <CourseNotFoundWarning />; }

    const role = course.roles.find(r => r.id == roleId);
    // only teachers can switch their role
    if (!role || !course.roles.teacher) {
      return <CourseNotFoundWarning />;
    }
    role.become();
    const { state } = location;
    const returnTo = (state && state.returnTo) || `/course/${courseId}`;
    return <Redirect push to={returnTo} />;
  };

  return {
    dashboard() { return renderDashboard; },
    becomeRole() { return renderBecomeRole; },
  };
};

export { getConditionalHandlers };
