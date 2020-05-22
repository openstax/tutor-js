import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { extend } from 'lodash';
import { asyncComponent } from './async-component';
import { CourseNotFoundWarning } from '../components/course-not-found-warning';
import Courses from '../models/courses-map';
import { OXMatchByRouter } from 'shared';


const StudentDashboard = asyncComponent(
  () => import('../screens/student-dashboard'), 'Course Dashboard',
);

const TeacherDashboard = asyncComponent(
  () => import('../screens/teacher-dashboard'), 'Course Dashboard',
);

const StudentGradebook = asyncComponent(
  () => import('../screens/student-gradebook'), 'Gradebook',
);

const TeacherGradebook = asyncComponent(
  () => import('../screens/teacher-gradebook'), 'Gradebook'
);

const getConditionalHandlers = (Router) => {
  const MatchForTutor = OXMatchByRouter(Router, null, 'TutorRouterMatch');

  const renderTeacherStudent = (props, Teacher, Student) => {
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
      return <Teacher {...props} />;
    } else {
      return <Student {...props} />;
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
    dashboard() { return (props) => renderTeacherStudent(props, TeacherDashboard, StudentDashboard); },
    gradebook() { return (props) => renderTeacherStudent(props, TeacherGradebook, StudentGradebook); },
    becomeRole() { return renderBecomeRole; },
  };
};

export { getConditionalHandlers };
