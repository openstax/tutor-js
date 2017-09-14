import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Modal, Button } from 'react-bootstrap';

import { AsyncButton } from 'shared';
import Courses from '../../models/courses-map';
import Course from '../../models/course';
import { TutorInput } from '../tutor-input';
import Icon from '../icon';


@observer
export default class RenameCourse extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  @observable showModal = false;
  @observable isValid = true;
  @observable newName = '';

  @action.bound close() {
    this.showModal = false;
  }

  @action.bound open() {
    this.showModal = true;
  }

  @action.bound validate(name) {
    this.isValid = (
      name != this.props.course.name && Courses.isNameValid(name)
    );
  }

  @action.bound onChange(name) {
    this.newName = name;
  }

  @action.bound
  performUpdate() {
    if (this.isValid) {
      this.props.course.name = this.newName;
      this.props.course.save().then(this.close);
    }
  }

  render() {
    return (
      <Button onClick={this.open} bsStyle="link" className="control edit-course">
        <Icon type="pencil" />

        Rename Course

        <Modal
          show={this.showModal}
          onHide={this.close}
          className="settings-edit-course-modal">
          <Modal.Header closeButton={true}>
            <Modal.Title>
              Rename Course
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TutorInput
              label="Course Name"
              ref={i => this.input = i}
              name="course-name"
              onChange={this.onChange}
              default={this.props.course.name}
              validate={this.validate}
              autoFocus={true} />
          </Modal.Body>
          <div className="modal-footer">
            <AsyncButton
              className="-edit-course-confirm"
              onClick={this.performUpdate}
              isWaiting={this.props.course.hasApiRequestPending}
              waitingText="Saving..."
              disabled={false === this.isValid}
            >
              Rename
            </AsyncButton>
          </div>
        </Modal>
      </Button>
    );
  }

}
