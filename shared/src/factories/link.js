import React from 'react';
import { Link } from 'react-router-dom';
import concat from 'lodash/concat';
import PropTypes from 'prop-types';
import qs from 'qs';
import { filterProps as filterPropsBase } from '../helpers/react';

import classnames from 'classnames';

const LINK_PROPS = [
  'alt',
  'title',
  'activeOnlyWhenExact',
  'activeStyle',
  'isActive',
  'location',
  'disabled',
];

const filterProps = function(props, options = {}) {
  options.props = concat(LINK_PROPS, options.props || []);
  return filterPropsBase(props, options);
};

const make = function(router, name = 'OpenStax') {
  return class extends React.Component {
    static displayName = `${name}Link`;

    static propTypes = {
      to:     PropTypes.string.isRequired,
      params: PropTypes.object,
      query:  PropTypes.object,
      className: PropTypes.string,
      primaryBtn:  PropTypes.bool,
    };

    render() {
      let { to, params, query, primaryBtn, className } = this.props;

      if (primaryBtn) {
        className = classnames(className, 'btn', 'btn-default', 'btn-primary');
      }
      if (!router.makePathname) {
        return (
          <p>
            no router?
          </p>
        );
      }

      const pathname = router.makePathname(to, params);

      to =
        { pathname: pathname || to };
      if (query) {
        to.search = qs.stringify(query);
      }

      // TODO see about isActive
      return <Link to={to} {...filterProps(this.props)} className={className} />;
    }
  };
};

export { make, filterProps };
