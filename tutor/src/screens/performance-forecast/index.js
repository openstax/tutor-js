import React from 'react';
import { ScrollToTop } from 'shared';
import Router from '../../helpers/router';
import * as PerformanceForecast from '../../flux/performance-forecast';
import LoadableItem from '../../components/loadable-item';
import Header from '../../components/header';
import TeacherComponent from './teacher';
import StudentComponent from './student';
import TeacherStudentComponent from './teacher-student';
import Courses from '../../models/courses-map';
import './styles.scss';

//eslint-disable-next-line react/prefer-stateless-function
class Student extends React.Component {
    static displayName = 'PerformanceForecastStudentShell';

    render() {
        const { courseId } = Router.currentParams();

        return (
            <LoadableItem
                id={courseId}
                store={PerformanceForecast.Student.store}
                actions={PerformanceForecast.Student.actions}
                renderItem={function() { return <StudentComponent courseId={courseId} />; }} />
        );
    }
}

// The teacher student store depends on both the
// scores report store as well as the teacher student learning guide
//eslint-disable-next-line react/prefer-stateless-function
class TeacherStudent extends React.Component {
    static displayName = 'PerformanceForecastTeacherStudentShell';

    render() {
        const { courseId, roleId } = Router.currentParams();
        return <TeacherStudentComponent courseId={courseId} roleId={roleId} />;
    }
}

//eslint-disable-next-line react/prefer-stateless-function
class Teacher extends React.Component {
    static displayName = 'PerformanceForecastTeacherShell';

    render() {
        const { courseId } = Router.currentParams();
        return (
            <LoadableItem
                id={courseId}
                store={PerformanceForecast.Teacher.store}
                actions={PerformanceForecast.Teacher.actions}
                renderItem={function() { return <TeacherComponent courseId={courseId} />; }} />
        );
    }
}

//eslint-disable-next-line react/prefer-stateless-function
class Guide extends React.Component {
    static displayName = 'PerformanceForecastGuide';

    render() {
        const { courseId, roleId } = Router.currentParams();
        const { isTeacher } = Courses.get(courseId).currentRole;

        let body;
        if ((roleId != null) && isTeacher) {
            body = <TeacherStudent />;
        } else if (isTeacher) {
            body = <Teacher />;
        } else {
            body = <Student />;
        }
        return (
            <ScrollToTop>
                <Header 
                    unDocked={true}
                    title="Performance Forecast"
                    backTo={Router.makePathname('dashboard', { courseId })}
                    backToText='Dashboard'
                />
                {body}
            </ScrollToTop>
        );
    }
}


export { Teacher, TeacherStudent, Student, Guide };
export default Guide;
