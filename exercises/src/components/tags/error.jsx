import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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
      <i className="fa fa-exclamation-triangle" />
    </OverlayTrigger>
  );
}

TagError.propTypes = {
  error: React.PropTypes.string,
};

export default TagError;
