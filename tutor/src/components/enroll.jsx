import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import Enroll from '../models/course/enroll';
import Router from '../helpers/router';
import { withRouter } from 'react-router-dom';
import studentIDForm from './enroll/student-id';
import invalidCode from './enroll/invalid-code';
import invalidLinks from './enroll/invalid-links-use';
import invalidLMS from './enroll/invalid-lms-use';
import invalidTeacher from './enroll/invalid-teacher';
import selectPeriod from './enroll/select-periods';
import droppedStudent from './enroll/dropped-student';
import courseEnded from './enroll/course-ended';
import unknownError from './enroll/unknown-error';

@withRouter
@observer
export default
class CourseEnroll extends React.Component {

  static propTypes = {
      enrollment: PropTypes.object,
      history: PropTypes.object.isRequired,
  }

  static Components = {
      studentIDForm,
      selectPeriod,
      invalidLMS,
      invalidLinks,
      invalidCode,
      invalidTeacher,
      droppedStudent,
      courseEnded,
      unknownError,
  }

  enrollmentCode = Router.currentParams().enrollmentCode;
  enrollment = this.props.enrollment ||
    new Enroll({ enrollment_code: this.enrollmentCode, history: this.props.history });

  UNSAFE_componentWillMount() {
      this.enrollment.create();
  }

  render() {
      const { enrollment } = this;
      if (!enrollment.bodyContents) {
          return null;
      }

      return (
          <Modal.Dialog
              className="course-enroll"
          >
              {enrollment.bodyContents}
          </Modal.Dialog>
      );
  }
}
