import React from 'react';
import { omit } from 'lodash';
import cn from 'classnames';

function NewTabLink(props) {
  const { children, className } = props;

  const linkProps = omit(props, 'children', 'className');

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
  externalStyle: true,
  target: '_blank',
  tabIndex: 0,
};

NewTabLink.propTypes = {
  children:  React.PropTypes.node.isRequired,
  className: React.PropTypes.string,
  params:    React.PropTypes.object,
  query:     React.PropTypes.object,
  target:    React.PropTypes.string,
  tabIndex:  React.PropTypes.number,
  hideIcon:  React.PropTypes.bool,
};

export default NewTabLink;
