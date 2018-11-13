export * from 'shared/specs/helpers';
import { MemoryRouter as Router } from 'react-router-dom';
import React from 'react';
export { Router };
export Factory from './factories';

function C({ children }) {
  return <Router>{children}</Router>;
}
export { C };
