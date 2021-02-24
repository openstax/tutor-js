import PropTypes from 'prop-types';
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

NewTabLink.defaultProps = {
    target: '_blank',
    hideIcon: false,
    tabIndex: 0,
};

NewTabLink.propTypes = {
    href:      PropTypes.string,
    tabIndex:  PropTypes.number,
    hideIcon:  PropTypes.bool,
    children:  PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default NewTabLink;
