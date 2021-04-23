import React from 'react';
import { Modal } from 'react-bootstrap';
import { Icon } from 'shared';

export default function invalidLinksUse() {
    return (
        <div>
            <Modal.Header className="warning">
                <Icon type="exclamation-triangle" />
                <span>Sorry, this enrollment link isn’t valid</span>
            </Modal.Header>
            <Modal.Body>
                To enroll in this OpenStax Tutor course, access your course in your
                institution's Learning Management System (LMS). Launch OpenStax Tutor
                from your LMS.
            </Modal.Body>
        </div>
    );
}
