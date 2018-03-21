import React from 'react';

import Router from '../../helpers/router';
import PerformanceForecast from '../../flux/performance-forecast';
import LoadableItem from '../loadable-item';
import TeacherComponent from './teacher';
import StudentComponent from './student';
import TeacherStudentComponent from './teacher-student';

import Courses from '../../models/courses-map';

class Student extends React.Component {
  static displayName = 'PerformanceForecastStudentShell';

  render() {
    const { courseId } = Router.currentParams();
    return React.createElement(LoadableItem, {
      id: courseId,
      store: PerformanceForecast.Student.store,
      actions: PerformanceForecast.Student.actions,
      renderItem: () => (
        <StudentComponent courseId={courseId} />
      ),
    });
  }
}

// The teacher student store depends on both the
// scores report store as well as the teacher student learning guide
class TeacherStudent extends React.Component {
  static displayName = 'PerformanceForecastTeacherStudentShell';

  render() {
    return (
      <TeacherStudentComponent {...Router.currentParams()} />
    );
  }
}

class Teacher extends React.Component {
  static displayName = 'PerformanceForecastTeacherShell';

  render() {
    const { courseId } = Router.currentParams();
    return React.createElement(LoadableItem, {
      id: courseId,
      store: PerformanceForecast.Teacher.store,
      actions: PerformanceForecast.Teacher.actions,
      renderItem: () => (
        <TeacherComponent courseId={courseId} />
      ),
    });
  }
}

class Guide extends React.Component {
  static displayName = 'PerformanceForecastGuide';

  render() {
    const { courseId, roleId } = Router.currentParams();
    const { isTeacher } = Courses.get(courseId);
    if (roleId != null && isTeacher) {
      return <TeacherStudent />;
    } else if (isTeacher) {
      return <Teacher />;
    } else {
      return <Student />;
    }
  }
}

export default { Teacher, TeacherStudent, Student, Guide };
