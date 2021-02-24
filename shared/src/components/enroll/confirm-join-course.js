import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Row } from 'react-bootstrap';
const ENTER = 'Enter';

import AsyncButton from '../buttons/async-button';
import CcConflictMessage from './cc-conflict-message';
import MessageList from './message-list';

class ConfirmJoinCourse extends React.Component {
  static propTypes = {
      courseEnrollmentActions: PropTypes.shape({
          confirm: PropTypes.func.isRequired,
      }).isRequired,

      courseEnrollmentStore: PropTypes.shape({
          isBusy: PropTypes.bool,
          hasConflict: PropTypes.func.isRequired,
          description: PropTypes.func.isRequired,
          teacherNames: PropTypes.func.isRequired,
          getEnrollmentChangeId: PropTypes.func.isRequired,
          getStudentIdentifier: PropTypes.func.isRequired,
          errorMessages: PropTypes.func.isRequired,
      }).isRequired,

      optionalStudentId: PropTypes.bool,
  };

  onCancel = (ev) => {
      ev.preventDefault();
      return this.props.courseEnrollmentActions.confirm(this.props.courseEnrollmentStore.getEnrollmentChangeId());
  };

  onKeyPress = (ev) => {
      if (ev.key === ENTER) { this.onSubmit(); }
  };

  onSubmit = () => {
      return this.props.courseEnrollmentActions.confirm(
          this.props.courseEnrollmentStore.getEnrollmentChangeId(), this.getSchoolId()
      );
  };

  getSchoolId = () => { return ReactDOM.findDOMNode(this.refs.input).value; };

  render() {

      return (
          <Row>
              <div className="confirm-join form-group">
                  {this.props.courseEnrollmentStore.hasConflict() ? <MessageList
                      messages={[<CcConflictMessage courseEnrollmentStore={this.props.courseEnrollmentStore} />]}
                      alertType="info"
                      messagesType="conflicts" /> : undefined}
                  <MessageList messages={this.props.courseEnrollmentStore.errorMessages()} />
                  <h3 className="title text-center">
                      <div className="join">
              You are joining
                      </div>
                      <div className="course">
                          {this.props.courseEnrollmentStore.description()}
                      </div>
                      <div className="teacher">
                          {this.props.courseEnrollmentStore.teacherNames()}
                      </div>
                  </h3>
                  <p className="label">
            Enter your school-issued student ID that is used for grading
                  </p>
                  <div className="controls">
                      <div className="field">
                          <input
                              type="text"
                              className="form-control"
                              ref="input"
                              autoFocus={true}
                              defaultValue={this.props.courseEnrollmentStore.getStudentIdentifier()}
                              onKeyPress={this.onKeyPress} />
                          <AsyncButton
                              className="btn btn-success continue"
                              isWaiting={!!this.props.courseEnrollmentStore.isBusy}
                              waitingText="Confirming…"
                              onClick={this.onSubmit}
                          >Continue</AsyncButton>
                          <a
                              href="#" className="skip" onClick={this.onCancel}
                          >Add it later</a>
                      </div>
                      <div className="required">Required for credit</div>
                  </div>
              </div>
          </Row>
      );
  }
}


export default ConfirmJoinCourse;
