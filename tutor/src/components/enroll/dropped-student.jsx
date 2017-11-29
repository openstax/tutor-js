import React from 'react';
import { Modal } from 'react-bootstrap';
import Icon from '../icon';

export default function droppedStudent() {
  return (
    <div>
      <Modal.Header className="warning">
        <Icon type="exclamation-triangle" />
        <span>Sorry, you have been removed from this course</span>
      </Modal.Header>
      <Modal.Body>
        Please contact your instructor if you need access to this course.
      </Modal.Body>
    </div>
  );
}
