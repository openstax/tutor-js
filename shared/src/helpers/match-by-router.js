import React from 'react';
import PropTypes from 'prop-types';
import { omit, extend } from 'lodash';
import { Switch, Route } from 'react-router-dom';

const matchProps = function(Router, props, parent) {

  const path = parent.match ? `${parent.match.path}/${props.path}` : props.path;
  return extend(
    {},
    props,
    { path },
    {
      render(renderedProps) {
        const componentProps = extend({}, omit(props, 'render', 'getParamsForPath'), renderedProps);

        // ideally this would just be checking against the relevant path based on
        // path-specifc getParamsForPath, but the matching doesn't seem to match
        // to deepest match as expected, so get params based on all available paths for now.
        const params = Router.currentParams();

        return <props.render {...componentProps} params={params} />;
      },
    },
  );
};


const matchByRouter = function(Router, InvalidPage, displayName = 'RouterMatch') {
  const match = function(props) {
    if (!props.routes) { return null; }

    return (
      <Switch>
        {props.routes.map((route, i) =>
          <Route key={i} {...matchProps(Router, route, props)} />)}
        <Route component={InvalidPage} />
      </Switch>
    );
  };
  match.displayName = displayName;
  match.propTypes = {
    routes: PropTypes.array,
  };
  return match;
};

export default matchByRouter;
