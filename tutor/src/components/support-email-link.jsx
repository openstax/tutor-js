import PropTypes from 'prop-types';
import React from 'react';
import UserMenu from '../models/user/menu';

export default function SupportEmailLink({ displayEmail = false, label = 'Support' }) {
    if (displayEmail) { label = UserMenu.supportEmail; }
    return (
        <a href={`mailto:${UserMenu.supportEmail}`}>{label}</a>
    );
}

SupportEmailLink.propTypes = {
    displayEmail: PropTypes.bool,
    label: PropTypes.string,
};
