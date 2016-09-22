React    = require 'react'
{Match}  = require 'react-router'
defaults = require 'lodash/defaults'
without  = require 'lodash/without'
extend   = require 'lodash/extend'

matchProps = (props) ->
  defaults({}, props, render: ->
    <props.component {...without(props, 'component', 'render')} />
  )



RoutingHelper =

  subroutes: (routes) ->
    return null unless routes
    for route, i in routes
      <Match key={i} {...matchProps(route)} />

  component: ({routes}) ->
    return null unless routes
    <span>
      {for route, i in routes
        <Match key={i} {...matchProps(route)} />}
    </span>

module.exports = RoutingHelper
