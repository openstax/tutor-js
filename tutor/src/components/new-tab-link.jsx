import React from 'react';
import { omit } from 'lodash';
import cn from 'classnames';

function NewTabLink(props) {
  const { children, className } = props;

  const linkProps = omit(props, 'children', 'className', 'hideIcon');

  return (
    <a
      className={cn(className, { 'external-icon': !props.hideIcon })}
      {...linkProps}
    >
      {children}
    </a>
  );
}

NewTabLink.displayName = 'NewTabLink';

NewTabLink.contextTypes = {
  router: React.PropTypes.object,
};

NewTabLink.defaultProps = {
  target: '_blank',
  hideIcon: false,
  tabIndex: 0,
};

NewTabLink.propTypes = {
  href:      React.PropTypes.string,
  tabIndex:  React.PropTypes.number,
  hideIcon:  React.PropTypes.bool,
  children:  React.PropTypes.node.isRequired,
  className: React.PropTypes.string,
};

export default NewTabLink;
