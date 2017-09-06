import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function InvalidTeacher({ enrollment }) {

  return (
    <div className="is-teacher">
      <Modal.Body>
        <h3>Sorry, but that is not permitted.</h3>
        <p>
          It looks like you’re trying to enroll in {enrollment.courseName} using your instructor account.
        </p>
        <p>
          Contact <a href="mailto:{UserMenu.supportEmail}">Support</a> if you need help.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" className="cancel" onClick={enrollment.onCancel}>
          Continue to My courses
        </Button>
      </Modal.Footer>
    </div>
  );
}
