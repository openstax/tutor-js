import React from 'react';
import Router from '../../helpers/router';
import * as PerformanceForecast from '../../flux/performance-forecast';
import LoadableItem from '../../components/loadable-item';
import TeacherComponent from './teacher';
import StudentComponent from './student';
import TeacherStudentComponent from './teacher-student';
import Courses from '../../models/courses-map';
import './styles.scss';

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
class TeacherStudent extends React.Component {
  static displayName = 'PerformanceForecastTeacherStudentShell';

  render() {
    const { courseId, roleId } = Router.currentParams();
    return <TeacherStudentComponent courseId={courseId} roleId={roleId} />;
  }
}

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

class Guide extends React.Component {
  static displayName = 'PerformanceForecastGuide';

  render() {
    const { courseId, roleId } = Router.currentParams();
    const { isTeacher } = Courses.get(courseId);
    if ((roleId != null) && isTeacher) {
      return <TeacherStudent />;
    } else if (isTeacher) {
      return <Teacher />;
    } else {
      return <Student />;
    }
  }
}


export { Teacher, TeacherStudent, Student, Guide };
export default Guide;
