import React from 'react';
import { extend } from 'lodash';
import { Redirect } from 'react-router-dom';
import { asyncComponent } from './async-component';
import { CourseNotFoundWarning } from '../components/course-not-found-warning';
import Courses from '../models/courses-map';
import { OXMatchByRouter } from 'shared';

const StudentDashboard = asyncComponent(
  () => import('../screens/student-dashboard')
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

    if (course.isTeacher) {
      if (course.is_concept_coach) {
        return (
          <CCDashboard courseId={courseId} {...props} />
        );
      } else {
        return (
          <Redirect
            to={{
              pathname: Router.makePathname('viewTeacherDashboard', props.params),
              query: Router.currentQuery(),
            }} />
        );
      }
    } else {
      if (course.is_concept_coach) {
        return (
          <CCStudentRedirect courseId={courseId} />
        );
      } else {
        return <StudentDashboard {...props} />;
      }
    }
  };

  return {
    dashboard() { return renderDashboard; },
  };
};

export { getConditionalHandlers };
