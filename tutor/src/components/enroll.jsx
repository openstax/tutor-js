import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import Enroll from '../models/course/enroll';
import Router from '../helpers/router';

import StudentID from './enroll/student-id';
import invalidCode from './enroll/invalid-code';
import invalidTeacher from './enroll/invalid-teacher';
import SelectPeriod from './enroll/select-periods';

@observer
export default class CourseEnroll extends React.PureComponent {

  static contextTypes = {
    router: React.PropTypes.object,
  }

  static Components = {
    studentIDForm: StudentID,
    selectPeriod: SelectPeriod,
    invalidCode: invalidCode,
    invalidTeacher: invalidTeacher,
  }

  enrollmentCode = Router.currentParams().enrollmentCode;
  enrollment = this.props.enrollment ||
    new Enroll({ enrollment_code: this.enrollmentCode, router: this.context.router });

  componentDidMount() {
    this.enrollment.create();
  }

  render() {
    const { enrollment } = this;

    return (
      <Modal.Dialog className="course-enroll">
        {enrollment.bodyContents}
      </Modal.Dialog>
    );
  }
}
