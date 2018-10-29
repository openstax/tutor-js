import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import _ from 'underscore';

export default class extends React.Component {
  static defaultProps = {
    placement: 'bottom',
    isDisabled: false,
  };

  static displayName = 'ButtonWithTip';

  static propTypes = {
    isDisabled:  PropTypes.bool,
    onClick: PropTypes.func,
    id: PropTypes.string.isRequired,
    placement: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
    className: PropTypes.string,
    getTip: PropTypes.func.isRequired,
  };

  render() {
    let button;
    const { isDisabled, onClick, id, placement, children, className, getTip, disabledState } = this.props;

    const tip = getTip(this.props);

    const buttonProps = _.pick(this.props, 'className', 'variant', 'block');
    buttonProps.disabled = isDisabled;
    if (!isDisabled) { buttonProps.onClick = onClick; }

    if ((disabledState != null) && isDisabled) {
      button = disabledState;
    } else {
      button = <BS.Button {...buttonProps} role="link">
        {children}
      </BS.Button>;
    }

    if (tip) {
      const tooltip = <BS.Tooltip id={id}>
        {tip}
      </BS.Tooltip>;
      return (
        <BS.OverlayTrigger placement={placement} overlay={tooltip}>
          {button}
        </BS.OverlayTrigger>
      );
    } else {
      return button;
    }
  }
}
