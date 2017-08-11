React    = require 'react'
defaults = require 'lodash/defaults'
omit     = require 'lodash/omit'
extend   = require 'lodash/extend'
{ Switch, Route }  = require 'react-router-dom'

matchProps = (Router, props, parent) ->
  path = if parent.match then "#{parent.match.path}/#{props.path}" else props.path
  extend({}, props, { path }, render: (renderedProps) ->
    componentProps = extend({}, omit(props, 'render', 'getParamsForPath'), renderedProps)

    # ideally this would just be checking against the relevant path based on
    # path-specifc getParamsForPath, but the matching doesn't seem to match
    # to deepest match as expected, so get params based on all available paths for now.
    params = Router.currentParams()

    <props.render {...componentProps} params={params} />
  )


matchByRouter = (Router, InvalidPage, displayName = 'RouterMatch') ->
  match = (props) ->
    return null unless props.routes

    <Switch>
      {for route, i in props.routes
        <Route key={i} {...matchProps(Router, route, props)} />}
      <Route component={InvalidPage} />
    </Switch>
  match.displayName = displayName
  match

module.exports = matchByRouter
