import PropTypes from 'prop-types';
import React from 'react';
import { Row } from 'react-bootstrap';
import AsyncButton from '../buttons/async-button';
import MessageList from './message-list';

const ENTER = 'Enter';

class CcJoinConflict extends React.Component {
  static propTypes = {
      courseEnrollmentStore: PropTypes.shape({
          isBusy: PropTypes.bool,
          description: PropTypes.func.isRequired,
          teacherNames: PropTypes.func.isRequired,
          conflictDescription: PropTypes.func.isRequired,
          conflictTeacherNames: PropTypes.func.isRequired,
      }).isRequired,

      courseEnrollmentActions: PropTypes.shape({
          conflictContinue: PropTypes.func.isRequired,
      }).isRequired,
  };

  onKeyPress = (ev) => {
      if (ev.key === ENTER) { this.onSubmit(); }
  };

  onSubmit = () => {
      return this.props.courseEnrollmentActions.conflictContinue();
  };

  getConflictMessage = () => {
      return `You are already enrolled in another OpenStax Concept Coach using this textbook, ${this.props.courseEnrollmentStore.conflictDescription()} with ${this.props.courseEnrollmentStore.conflictTeacherNames()}. To make sure you don't lose work, we strongly recommend enrolling in only one Concept Coach per textbook. When you join the new course below, we will remove you from the other course.`;
  };

  render() {

      return (
          <Row>
              <div className="conflict form-group">
                  <MessageList messages={[this.getConflictMessage()]} />
                  <h3 className="title text-center no-border">
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
                  <AsyncButton
                      className="btn btn-success continue"
                      isWaiting={!!this.props.courseEnrollmentStore.isBusy}
                      waitingText="Confirming…"
                      onClick={this.onSubmit}>
                      {'\
    Continue\
    '}
                  </AsyncButton>
                  <div className="help-text">
                      {`\
    Still want to enroll in both courses?
    \
    `}
                      <a
                          href="http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3AConcept_Coach&q=ddd">
                          {'\
      Contact us.\
      '}
                      </a>
                  </div>
              </div>
          </Row>
      );
  }
}


export default CcJoinConflict;
