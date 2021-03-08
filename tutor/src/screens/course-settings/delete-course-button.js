import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { Icon } from 'shared';
import { colors } from 'theme'
import Course from '../../models/course';

const StyledModal = styled(Modal)`
    p.danger {
        font-weight: 700;
        color: ${colors.strong_red};
    }
`

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
          courseTeacherMembership.drop().then(history.push('/courses'));
      }
  }

  renderDeleteCourseButton() {
      return (
          <Button
              data-test-id="delete-course-btn"
              variant="link"
              onClick={this.open}>
              <Icon type="trash"/> Delete this course
          </Button>
      );
  }

  render() {
      const { course } = this.props;
      const hasAnyStudents = !isEmpty(course.roster.students.active);

      return (
      <>
        {this.renderDeleteCourseButton()}
        <StyledModal
            show={this.showModal}
            onHide={this.close}
            className="delete-course-modal">
            <Modal.Header closeButton>
                {`Delete ${course.name}?`}
            </Modal.Header>
            <Modal.Body>
                {hasAnyStudents && <p className="danger" data-test-id="disabled-delete-course-message">This course has students enrolled in it.</p>}
                <p>Are you sure you want to permanently delete this course? Once deleted, all data within this course will be lost.</p>
                <p>You can’t undo this action.</p>
            </Modal.Body>
            <div className="modal-footer">
                <Button variant="default" size="lg" onClick={this.deleteCourse}>
                  Yes, delete
                </Button>
                <Button variant="primary" size="lg" onClick={this.close}>
                  Cancel
                </Button>
            </div>
        </StyledModal>
      </>
      );
  }
}

export default DeleteCourseModal
