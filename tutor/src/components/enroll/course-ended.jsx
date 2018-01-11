import React from 'react';
import { Modal } from 'react-bootstrap';
import Icon from '../icon';

export default function droppedStudent() {
  return (
    <div>
      <Modal.Header className="warning">
        <Icon type="exclamation-triangle" />
        <span>Sorry, the course has ended</span>
      </Modal.Header>
      <Modal.Body>
        <p>
          The course that this enrollment link belongs to has ended and cannot be joined.
        </p>
        <p>
          Please contact your instructor for an updated link.
        </p>
      </Modal.Body>
    </div>
  );
}
