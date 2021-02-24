import PropTypes from 'prop-types';
import React from 'react';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { pick } from 'lodash';

export default class extends React.Component {
  static defaultProps = {
      placement: 'bottom',
      isDisabled: false,
  };

  static displayName = 'ButtonWithTip';

  static propTypes = {
      children:      PropTypes.node,
      disabledState: PropTypes.bool,
      isDisabled:    PropTypes.bool,
      onClick:       PropTypes.func,
      id:            PropTypes.string.isRequired,
      placement:     PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
      className:     PropTypes.string,
      getTip:        PropTypes.func.isRequired,
  };

  render() {
      let button;
      const { isDisabled, onClick, id, placement, children, getTip, disabledState } = this.props;

      const tip = getTip(this.props);

      const buttonProps = pick(this.props, 'className', 'variant', 'block');
      buttonProps.disabled = isDisabled;
      if (!isDisabled) { buttonProps.onClick = onClick; }

      if ((disabledState != null) && isDisabled) {
          button = disabledState;
      } else {
          button = <Button {...buttonProps} role="link">
              {children}
          </Button>;
      }

      if (tip) {
          const tooltip = <Tooltip id={id}>
              {tip}
          </Tooltip>;
          return (
              <OverlayTrigger placement={placement} overlay={tooltip}>
                  {button}
              </OverlayTrigger>
          );
      } else {
          return button;
      }
  }
}
