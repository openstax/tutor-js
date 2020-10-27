import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { camelCase } from 'lodash';
import { Icon } from 'shared';

function TagWrapper(props) {

  const classes = classnames('tag-type', camelCase(props.label), {
    'has-error': props.error,
    'has-single-tag': props.singleTag === true,
  });

  return (
    <div className={classes}>
      <div className="heading">
        <span className="label">
          {props.label}
          {props.icon}
        </span>
        <div className="controls">
          {props.onAdd && <Icon onClick={props.onAdd} type="plus-circle" />}
        </div>
      </div>
      {props.children}
    </div>
  );

}

TagWrapper.propTypes = {
  error: PropTypes.bool,
  onAdd: PropTypes.func,
  children: PropTypes.node,
  singleTag: PropTypes.bool,
  'has-single-tag': PropTypes.bool,
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
};


export default TagWrapper;
