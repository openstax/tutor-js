import React from 'react';
import { Modal } from 'react-bootstrap';
import { Icon } from 'shared';

export default function invalidLmsUse() {
    return (
        <div>
            <Modal.Header className="warning">
                <Icon type="exclamation-triangle" />
                <span>Sorry, you need an enrollment link</span>
            </Modal.Header>
            <Modal.Body>
        To enroll in this OpenStax Tutor course, use the course enrollment
        link provided by your instructor.
            </Modal.Body>
        </div>
    );
}
