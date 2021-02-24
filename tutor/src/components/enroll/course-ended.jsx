import React from 'react';
import { Modal } from 'react-bootstrap';
import { Icon } from 'shared';

export default function droppedStudent() {
    return (
        <div>
            <Modal.Header className="warning">
                <Icon type="exclamation-triangle" />
                <span>Sorry, the course has ended</span>
            </Modal.Header>
            <Modal.Body>
                <p>
          This is an old course enrollment link. Ask your instructor for the new link.
                </p>
            </Modal.Body>
        </div>
    );
}
