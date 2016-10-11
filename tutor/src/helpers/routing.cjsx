React    = require 'react'
defaults = require 'lodash/defaults'
omit     = require 'lodash/omit'
extend   = require 'lodash/extend'
{Match, Miss}  = require 'react-router'

InvalidPage = require '../components/invalid-page'

matchProps = (props, parentParams) ->
  extend({}, props, render: (renderedProps) ->
    componentProps = extend({}, omit(props, 'render'), renderedProps)
    params = extend({}, componentProps.params, parentParams)

    <props.render {...componentProps} params={params} />
  )

RoutingHelper =

  component: (props) ->
    return null unless props.routes

    <span>
      {for route, i in props.routes
        <Match key={i} {...matchProps(route, props.params)} />}
      <Miss component={InvalidPage} />
    </span>

module.exports = RoutingHelper
