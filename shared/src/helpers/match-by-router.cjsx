React    = require 'react'
defaults = require 'lodash/defaults'
omit     = require 'lodash/omit'
extend   = require 'lodash/extend'
{Match, Miss}  = require 'react-router'

matchProps = (Router, props, parentParams) ->
  extend({}, props, render: (renderedProps) ->
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

    <span>
      {for route, i in props.routes
        <Match key={i} {...matchProps(Router, route, props.params)} />}
      <Miss component={InvalidPage} />
    </span>
  match.displayName = displayName
  match

module.exports = matchByRouter
