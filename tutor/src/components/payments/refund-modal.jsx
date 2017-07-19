import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function RefundModal({ purchase, onRefund, onCancel }) {
  if (!purchase) { return null; }
  return (
    <Modal.Dialog
      className="refund"
    >
      <Modal.Header>
        <Modal.Title>You are requesting a refund for {purchase.product.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        This will remove you from the class and you will no longer have access to
        your work. Are you sure you want to continue?
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onRefund} bsStyle="primary">Continue</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Modal.Footer>

    </Modal.Dialog>
  );
}
