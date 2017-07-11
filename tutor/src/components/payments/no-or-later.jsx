import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { isEmpty } from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import Courses from '../models/courses-map';
import { AsyncButton } from 'shared';
import Router from '../helpers/router';
import BackButton from './buttons/back-button';

@observer
export default class PayNowOrLater extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
  }

  student = Courses.get(this.props.courseId).userStudentRecord;

  @action.bound
  onPurchase() {

  }

  @action.bound
  onSaved() {
    this.isSaved = true;
  }

  @action.bound
  goToDashboard() {
    this.context.router.transitionTo(Router.makePathname('dashboard', { courseId: this.props.courseId }));
  }

  render() {
    if (this.isSaved) { return this.renderSuccess(); }

    return (
      <Modal.Dialog className="change-student-id">
        <Modal.Body>
          <div className="title">
            <h3>Update your student identifier</h3>
          </div>
          <div className="sub-title">Enter your school-issued student ID number *</div>
          <div className="inputs">
            <span className="student-id-icon"></span>
            <input
              autoFocus
              onKeyUp={this.checkValidity}
              ref={i => (this.input = i)}
              placeholder='School issued ID'
              defaultValue={this.student.student_identifier}
            />
          </div>
          {this.isValid ? null : this.renderWarning()}
          <div className="required">* required for course credit</div>
        </Modal.Body>
        <Modal.Footer>
          <AsyncButton
            disabled={!this.isValid}
            bsStyle="primary"
            className="btn btn-success"
            isWaiting={!!this.student.hasApiRequestPending}
            waitingText={'Confirming…'}
            onClick={this.onSubmit}
          >
            Save
          </AsyncButton>
          <Button className="cancel" bsStyle="link" onClick={this.goToDashboard}>Cancel</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
