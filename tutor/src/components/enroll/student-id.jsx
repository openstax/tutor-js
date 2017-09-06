import React from 'react';
import { Modal } from 'react-bootstrap';

export default function StudentIDForm({ enrollment }) {
  return (
    <div className="enroll-form">
      <Modal.Body>
        <div className="title">
          <p className="joining">You are joining</p>
          <h3>{enrollment.courseName}</h3>
        </div>

        <div className="sub-title">Enter your school-issued student ID number *</div>
        <div className="inputs">
          <span className="student-id-icon"></span>
          <input
            autoFocus
            ref={i => (this.input = i)}
            placeholder='School issued ID'
          />
        </div>
        <div className="required">* required for course credit</div>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" className="btn btn-success" onClick={this.onSubmit}>Continue</Button>
        <Button className="cancel" bsStyle="link" onClick={this.onSubmit}>Add it later</Button>
      </Modal.Footer>
    </div>
  );
}
