import React from 'react';
import { map } from 'lodash';
import { Modal } from 'react-bootstrap';
import Icon from '../icon';
import { toSentence } from '../../helpers/string';

export default function unknownError({ errors }) {
  const error = toSentence(map(errors, (e) => `${e.code}: ${e.message}`));
  return (
    <div>
      <Modal.Header className="warning">
        <Icon type="exclamation-triangle" />
        <span>Sorry, an error occured</span>
      </Modal.Header>
      <Modal.Body>
        <p>
          {error}
        </p>
      </Modal.Body>
    </div>
  );
}
