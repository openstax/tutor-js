import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import UserMenu from '../../models/user/menu';
import PropTypes from 'prop-types';

export default function InvalidTeacher({ enrollment }) {

  return (
    <div className="is-teacher">
      <Modal.Body>
        <h3>Sorry, you can’t enroll as a student in your course using this email address.</h3>
        <p>
          It looks like you’re trying to enroll in {enrollment.courseName} using your instructor account.
        </p>
        <p>
          Contact <a href={`mailto:${UserMenu.supportEmail}`}>Support</a> if you need help.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" className="cancel" onClick={enrollment.onCancel}>
          Continue to My courses
        </Button>
      </Modal.Footer>
    </div>
  );
}

InvalidTeacher.propTypes = {
  enrollment: PropTypes.shape({
    courseName: PropTypes.string,
    onCancel: PropTypes.func,
  }),
}
