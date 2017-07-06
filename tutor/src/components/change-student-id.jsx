import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Modal, Button } from 'react-bootstrap';
import Courses from '../models/courses-map';
import { AsyncButton } from 'shared';
import Router from '../helpers/router';
import BackButton from './buttons/back-button';
import cn from 'classnames';

function isJoining() {
  const { entry: { name } } = Router.currentMatch();
  return (name === 'joinStudentId');
}

function Title() {
  const { params: { courseId } } = Router.currentMatch();
  if (isJoining()) {
    return (
      <div className="title">
        <p className="joining">You are joining</p>
        <h3>{Courses.get(courseId).name}</h3>
      </div>
    );
  }
  return (
    <div className="title">
      <h3>Update your student identifier</h3>
    </div>
  );
}


@observer
export default class ChangeStudentId extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  courseId = Router.currentParams().courseId;
  student = Courses.get(this.courseId).userStudentRecord;

  @observable isSaved = false;

  @action.bound
  onChange(ev) {
    this.student.student_identifier = ev.target.value;
  }

  @action.bound
  onSubmit() {
    this.student.student_identifier = this.input.value;
    this.student.save().then(this.onSaved);
  }

  @action.bound
  onSaved() {
    if (isJoining()) {
      this.goToDashboard();
    } else {
      this.isSaved = true;
    }
  }

  @action.bound
  goToDashboard() {
    this.context.router.transitionTo(Router.makePathname('dashboard', { courseId: this.courseId }));
  }

  renderSuccess() {
    return (
      <Modal.Dialog className={cn('change-student-id', { 'is-join': isJoining() })}>
        <Modal.Body>
          <h3>You have successfully updated your student identifier.</h3>
        </Modal.Body>
        <Modal.Footer>
          <BackButton fallbackLink={{
            to: 'dashboard', text: 'Back to Dashboard', params: { courseId: this.courseId },
          }} />
        </Modal.Footer>
      </Modal.Dialog>
    );
  }

  render() {
    if (this.isSaved) { return this.renderSuccess(); }

    return (
      <Modal.Dialog className={cn('change-student-id', { 'is-join': isJoining() })}>
        <Modal.Body>
          <Title />
          <div className="sub-title">Enter your school-issued student ID number *</div>
          <div className="inputs">
            <span className="student-id-icon"></span>
            <input
              autoFocus
              ref={i => (this.input = i)}
              placeholder='School issued ID'
              defaultValue={this.student.student_identifier}
            />
          </div>
          <div className="required">* required for course credit</div>
        </Modal.Body>
        <Modal.Footer>
          <AsyncButton
            bsStyle="primary"
            className="btn btn-success"
            isWaiting={!!this.student.hasApiRequestPending}
            waitingText={'Confirming…'}
            onClick={this.onSubmit}
          >
            {isJoining() ? 'Continue' : 'Save'}
          </AsyncButton>
          <Button className="cancel" bsStyle="link" onClick={this.goToDashboard}>{isJoining() ? 'Add it later' : 'Cancel'}</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
