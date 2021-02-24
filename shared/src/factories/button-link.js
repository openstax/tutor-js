import PropTypes from 'prop-types';
import React from 'react';

import { concat } from 'lodash';
import { Button } from 'react-bootstrap';
import { filterProps as reactFilterProps } from '../helpers/react';

const BUTTON_LINK_PROPS = [
    'alt',
    'title',
    'active',
    'type',
    'block',
    'componentClass',
    'disabled',
];

const BUTTON_LINK_PREFIXES = [
    'bs',
];

const filterProps = function(props, options = {}) {
    options.props = concat(BUTTON_LINK_PROPS, options.props || []);
    options.prefixes = concat(BUTTON_LINK_PREFIXES, options.prefixes || []);
    return reactFilterProps(props, options);
};

const make = (router, name = 'OpenStax') => {
    return class extends React.Component {
    static displayName = `${name}ButtonLink`;

    static propTypes = {
        to:     PropTypes.string.isRequired,
        params: PropTypes.object,
        query:  PropTypes.object,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        return this.setState({ fullPathname: this.makeFullPathname(nextProps) });
    }

    makeFullPathname = (props) => {
        if (props == null) { (((({ props } = this)))); }
        const { to, params, query } = props;
        return router.makePathname(to, params, { query });
    };

    goToPathname = (clickEvent) => {
        clickEvent.preventDefault();
        return router.transitionTo(this.state.fullPathname);
    };

    state = { fullPathname: this.makeFullPathname() };

    render() {
        const { fullPathname } = this.state;

        return (
            <Button
                href={fullPathname}
                onClick={this.goToPathname}
                {...filterProps(this.props)} />
        );
    }
    };
};

export { make, filterProps };
