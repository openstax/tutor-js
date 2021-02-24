import React from 'react';
import { Alert } from 'react-bootstrap';

const Loading = () => (
    <Alert variant="info">Loading…</Alert>
);

const NotFound = () => (
    <Alert variant="danger">Exercise was not found</Alert>
);


export { Loading, NotFound };
