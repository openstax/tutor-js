import PropTypes from 'prop-types';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import CopyOnFocusInput from '../copy-on-focus-input';
import Course from '../../models/course';
import Icon from '../icon';

const AddTeacherModal = ({ show, onClose, url }) => (
  <Modal
    size="lg"
    show={show}
    onHide={onClose}
    className="settings-add-instructor-modal"
  >
    <Modal.Header closeButton={true}>
      <Modal.Title>
        Add Teacher
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        Share this link with an instructor so they can add themselves to the course:
      </p>
      <CopyOnFocusInput value={url} focusOnMount={true} />
      <p className="warning">
        <Icon type="exclamation-triangle" /> Do not share this link with students
      </p>
    </Modal.Body>
  </Modal>
);

export default
@observer
class AddTeacherLink extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @observable isShown = false;

  @action.bound onClose() {
    this.isShown = false;
  }

  @action.bound onShow() {
    this.isShown = true;
  }

  render() {
    const { course } = this.props;
    return (
      <Button
        onClick={this.onShow}
        variant="link"
        className="control add-teacher">
        <Icon type="plus" />
        Add Instructor
        <AddTeacherModal
          url={course.roster.teach_url || ''}
          show={this.isShown}
          onClose={this.onClose} />
      </Button>
    );
  }

};
