import React from 'react';
import invariant from 'invariant';
import { extend, last, first } from 'lodash';
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
  // eslint-disable-next-line react/prop-types
  const legacyReferenceBookRedirect = ({ params }) => {
    const parts = params.parts.split('/');
    const course = Courses.get(first(parts));
    invariant(course, `Did not find course for params '${params}'`);
    const chapterSection = parts.length > 1 ? last(parts) : 0;
    return (
      <Redirect
        to={{
          pathname: Router.makePathname(
            chapterSection ? 'viewReferenceBookSection' : 'viewReferenceBook',
            {
              ecosystemId: course.ecosystem_id,
              chapterSection,
            }),
          query: Router.currentQuery(),
        }}
      />
    );
  };

  return {
    dashboard() { return renderDashboard; },
    legacyReferenceBookRedirect() { return legacyReferenceBookRedirect; },
  };
};

export { getConditionalHandlers };
