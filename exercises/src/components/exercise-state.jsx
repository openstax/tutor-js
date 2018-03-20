import React from 'react';
import { Alert } from 'react-bootstrap';

const Loading = () => (
  <Alert bsStyle="info">Loading…</Alert>
);

const NotFound = () => (
  <Alert bsStyle="danger">Exercise was not found</Alert>
);


export { Loading, NotFound };
