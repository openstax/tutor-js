import React from 'react';
import { Col } from 'react-bootstrap';
import classnames from 'classnames';

function TagWrapper(props) {

  const classes = classnames('tag-type', {
    'has-error': props.error,
    'has-single-tag': props.singleTag === true,
  });

  return (
    <Col sm={12} lg={6} className={classes}>
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
    </Col>
  );

}

TagWrapper.propTypes = {
  label: React.PropTypes.string.isRequired,
};


export default TagWrapper;
