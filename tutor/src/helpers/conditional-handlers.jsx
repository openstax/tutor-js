import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { extend } from 'lodash';
import { asyncComponent } from './async-component';
import { CourseNotFoundWarning } from '../components/course-not-found-warning';
import { currentCourses, currentUser } from '../models'
import { OXMatchByRouter } from 'shared';

const StudentCourses = asyncComponent(
    () => import('../components/my-courses'), 'My Courses',
);

const TeacherCourses = asyncComponent(
    () => import('../screens/my-courses'), 'My Courses',
);

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

const PreWRMGradebook =  asyncComponent(
    () => import('../screens/pre-wrm-scores-report'), 'Gradebook'
);

const getConditionalHandlers = (Router) => {
    const MatchForTutor = OXMatchByRouter(Router, null, 'TutorRouterMatch');

    const renderTeacherStudentMyCourses = () => {
        return (props) => {
            if(currentUser.isProbablyTeacher) {
                return <TeacherCourses {...props} />
            }
            return <StudentCourses {...props} />
        }
    }

    const renderTeacherStudentCourseScreen = (Teacher, Student) => {
        return (props) => {
            const { courseId } = props.params;
            extend(props, { courseId });
            const course = currentCourses.get(courseId);

            if (!props.match.isExact) {
                return (
                    <MatchForTutor {...props} />
                );
            }
            if (course && course.currentRole.isTeacher) {
                return <Teacher {...props} />;
            } else {
                return <Student {...props} />;
            }
        };
    };

    const renderGradeBook = () => {
        const gradeBookRenderer = renderTeacherStudentCourseScreen(TeacherGradebook, StudentGradebook);
        return (props) => {
            const course = currentCourses.get(props.params.courseId);
            if (course && course.currentRole.isTeacher && course.uses_pre_wrm_scores) {
                return <PreWRMGradebook {...props} />;
            }
            return gradeBookRenderer(props);
        };
    };
    // eslint-disable-next-line react/prop-types
    const renderBecomeRole = ({ params: { courseId, roleId } }) => {
        const location = useLocation();
        const course = currentCourses.get(courseId);
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

    // care must be taken to always return the same function on every call.
    // If the function is dyamically created, react will mount/unmount itself
    // AND ITS CHILDREN, which is almost always undesirable and will trigger api reloads
    const myCourses = renderTeacherStudentMyCourses();
    const dashboard = renderTeacherStudentCourseScreen(TeacherDashboard, StudentDashboard);
    const gradebook = renderGradeBook();
    return {
        myCourses() { return myCourses; },
        dashboard() { return dashboard; },
        gradebook() { return gradebook; },
        becomeRole() { return renderBecomeRole; },
    };
};

export { getConditionalHandlers };
