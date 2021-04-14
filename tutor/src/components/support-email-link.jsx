import PropTypes from 'prop-types';
import React from 'react';
import { SUPPORT_EMAIL } from '../config'


export default function SupportEmailLink({ displayEmail = false, label = 'Support' }) {
    if (displayEmail) { label = SUPPORT_EMAIL; }
    return (
        <a href={`mailto:${SUPPORT_EMAIL}`}>{label}</a>
    );
}

SupportEmailLink.propTypes = {
    displayEmail: PropTypes.bool,
    label: PropTypes.string,
};
