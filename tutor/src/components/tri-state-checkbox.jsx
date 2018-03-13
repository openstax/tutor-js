import React from 'react';
import { keys } from 'lodash';
import classnames from 'classnames';

import Icon from './icon';

const ICON_TYPES = {
  partial:   'check-square-o',
  checked:   'check-square',
  unchecked: 'square-o',
};

class TriStateCheckbox extends React.Component {
  static propTypes = {
    type: React.PropTypes.oneOf(keys(ICON_TYPES)).isRequired,
    onClick: React.PropTypes.func,
  };

  onClick = (ev) => {
    ev.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(ev);
    }
  };

  render() {
    let styles;
    if (this.props.onClick) {
      styles = { cursor: 'pointer' };
    }
    const classNames = classnames('tri-state-checkbox', this.props.type);
    return (
      <span tabIndex={1} className={classNames} onClick={this.onClick}>
        <Icon
          type={ICON_TYPES[this.props.type]}
          onClick={this.props.onClick}
          style={styles} />
      </span>
    );
  }
}

export default TriStateCheckbox;
