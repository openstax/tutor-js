export * from 'shared/specs/helpers';
import { MemoryRouter as Router } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Factory from './factories'

export { Router, Factory };

function C({ children }) {
    return <Router>{children}</Router>;
}
C.propTypes = {
    children: PropTypes.node.isRequired,
};
export { C };
