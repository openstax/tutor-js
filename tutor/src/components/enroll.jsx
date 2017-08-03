import React from 'react';
import { Redirect } from 'react-router';
import Router from '../helpers/router';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { Modal, Button, Alert } from 'react-bootstrap';
import Enroll from '../models/course/enroll';
import Activity from './ox-fancy-loader';

@observer
export default class CourseEnroll extends React.PureComponent {

  static contextTypes = {
    router: React.PropTypes.object,
  }

  enrollmentCode = Router.currentParams().enrollmentCode;
  enrollment = new Enroll({ enrollment_code: this.enrollmentCode });

  componentDidMount() {
    this.enrollment.create();
  }

  @action.bound
  onSubmit() {
    this.enrollment.student_identifier = this.input.value;
    this.enrollment.confirm();
  }

  renderForm(enrollment) {
    return (
      <div>
        <Modal.Body>
          <div className="title">
            <p className="joining">You are joining</p>
            <h3>{enrollment.courseDescription}</h3>
          </div>

          <div className="sub-title">Enter your school-issued student ID number *</div>
          <div className="inputs">
            <span className="student-id-icon"></span>
            <input
              autoFocus
              ref={i => (this.input = i)}
              placeholder='School issued ID'
            />
          </div>
          <div className="required">* required for course credit</div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" className="btn btn-success" onClick={this.onSubmit}>Continue</Button>
          <Button className="cancel" bsStyle="link" onClick={this.onSubmit}>Add it later</Button>
        </Modal.Footer>
      </div>
    );
  }

  renderInvalid() {
    return (
      <Modal.Body>
        <Alert bsStyle="danger">
          The provided enrollment code is not valid. Please verify the enrollment code and try again.
        </Alert>
      </Modal.Body>
    );
  }

  render() {
    const { enrollment } = this;
    let body;

    if (enrollment.isLoading) {
      body = <Activity isLoading={true} />;
    } else if (enrollment.isInvalid) {
      body = this.renderInvalid();
    } else if (enrollment.isComplete) {
      if (enrollment.courseId)
        body = <Redirect to={Router.makePathname('dashboard', { courseId: enrollment.courseId })} />;
      else
        body = <Redirect to={Router.makePathname('myCourses')} />;
    } else {
      body = this.renderForm(enrollment);
    }

    return (
      <Modal.Dialog className="course-enroll">
        {body}
      </Modal.Dialog>
    );
  }
}
