import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import Enroll from '../models/course/enroll';
import Router from '../helpers/router';

import studentIDForm from './enroll/student-id';
import invalidCode from './enroll/invalid-code';
import invalidLinks from './enroll/invalid-links-use';
import invalidLMS from './enroll/invalid-lms-use';
import invalidTeacher from './enroll/invalid-teacher';
import selectPeriod from './enroll/select-periods';
import droppedStudent from './enroll/dropped-student';

@observer
export default class CourseEnroll extends React.PureComponent {

  static propTypes = {
    enrollment: React.PropTypes.object,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  static Components = {
    studentIDForm,
    selectPeriod,
    invalidLMS,
    invalidLinks,
    invalidCode,
    invalidTeacher,
    droppedStudent,
  }

  enrollmentCode = Router.currentParams().enrollmentCode;
  enrollment = this.props.enrollment ||
    new Enroll({ enrollment_code: this.enrollmentCode, router: this.context.router });

  componentWillMount() {
    this.enrollment.create();
  }

  render() {
    const { enrollment } = this;

    return (
      <Modal.Dialog
        backdropClassName="course-enroll"
        className="course-enroll"
      >
        {enrollment.bodyContents}
      </Modal.Dialog>
    );
  }
}
