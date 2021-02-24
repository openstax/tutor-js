import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from 'shared';

function TagError(props) {
    if (!props.error) { return null; }

    const tooltip = (
        <Tooltip id="input-error">
            <strong>
                {props.error}
            </strong>
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="top" overlay={tooltip}>
            <Icon type="exclamation-triangle" />
        </OverlayTrigger>
    );
}

TagError.propTypes = {
    error: PropTypes.string,
};

export default TagError;
