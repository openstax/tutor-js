import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { Icon } from 'shared';
import Course from '../../models/course';

@observer
class DeleteCourseModal extends React.Component {

  static propTypes = {
      course: PropTypes.instanceOf(Course).isRequired,
      history: PropTypes.shape({
          push: PropTypes.func,
      }).isRequired,
  }

  @observable showModal = false;

  @action.bound close() {
      this.showModal = false;
  }

  @action.bound open() {
      this.showModal = true;
  }

  @action.bound deleteCourse() {
      const { course, history } = this.props;
      const courseTeacherMembership = course.currentCourseTeacher;
      if (courseTeacherMembership.isTeacherOfCourse) {
          courseTeacherMembership.drop().then(history.push('/dashboard'));
      }
  }

  renderDeleteCourseButton() {
      const { course } = this.props;
      const hasAnyStudents = !isEmpty(course.roster.students.active);

      if(hasAnyStudents) {
          const tooltip = (
              <Tooltip className="disabled-delete-course-message">
                  <p>This course has students enrolled in it and can not be deleted. To delete this course, drop all the students enrolled in it.</p>
              </Tooltip>
          );
          return (
              <OverlayTrigger placement="right" overlay={tooltip}>
                  <span className="disabled-delete-course"><Icon type="trash"/> Delete this course</span>
              </OverlayTrigger>
          );
      }
      return (
          <Button
              variant="link"
              onClick={this.open}>
              <Icon type="trash"/> Delete this course
          </Button>
      );
  }

  render() {
      const { course } = this.props;

      return (
      <>
        {this.renderDeleteCourseButton()}
        <Modal
            show={this.showModal}
            onHide={this.close}
            className="delete-course-modal">
            <Modal.Header closeButton>
                {`Delete ${course.name}?`}
            </Modal.Header>
            <Modal.Body>
                <p>
          Are you sure you want to permanently delete this course? Once deleted, all data within this course will be lost.
                </p>
                <p>
          You can’t undo this action.
                </p>
            </Modal.Body>
            <div className="modal-footer">
                <Button variant="default" size="lg" onClick={this.deleteCourse}>
                  Yes, delete
                </Button>
                <Button variant="primary" size="lg" onClick={this.close}>
                  Cancel
                </Button>
            </div>
        </Modal>
      </>
      );
  }
}

export default DeleteCourseModal
