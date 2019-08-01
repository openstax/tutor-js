import React from 'react';
import { Redirect } from 'react-router-dom';
import { extend } from 'lodash';
import { asyncComponent } from './async-component';
import { CourseNotFoundWarning } from '../components/course-not-found-warning';
import Courses from '../models/courses-map';
import { OXMatchByRouter } from 'shared';

const StudentDashboard = asyncComponent(
  () => import('../screens/student-dashboard')
);

const TeacherDashboard = asyncComponent(
  () => import('../screens/teacher-dashboard')
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
    const course = Courses.get(courseId);
    const role = course.roles.find(r => r.id == roleId);

    if (!course || !course.roles.teacher || !role) {
      return <CourseNotFoundWarning />;
    }

    if (course.currentRole.isTeacherStudent) {
      course.current_role_id = null;
    } else {
      role.become();
    }

    return <Redirect push to={`/course/${courseId}`} />;
  };

  return {
    dashboard() { return renderDashboard; },
    becomeRole() { return renderBecomeRole; },
  };
};

export { getConditionalHandlers };
