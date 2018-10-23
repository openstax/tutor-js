import PropTypes from 'prop-types';
import React from 'react';
import { Col } from 'react-bootstrap';
import classnames from 'classnames';

function TagWrapper(props) {

  const classes = classnames('tag-type', {
    'has-error': props.error,
    'has-single-tag': props.singleTag === true,
  });

  return (
    <div className={classes}>
      <div className="heading">
        <span className="label">
          {props.label}
        </span>
        <div className="controls">
          {props.onAdd ?
            <i onClick={props.onAdd} className="fa fa-plus-circle" /> : undefined}
        </div>
      </div>
      {props.children}
    </div>
  );

}

TagWrapper.propTypes = {
  label: PropTypes.string.isRequired,
};


export default TagWrapper;
