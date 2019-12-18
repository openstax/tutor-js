export * from 'shared/specs/helpers';
import { MemoryRouter as Router } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
export { Router };
export Factory from './factories';

function C({ children }) {
  return <Router>{children}</Router>;
}
C.propTypes = {
  children: PropTypes.node.isRequired,
};
export { C };
