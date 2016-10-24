React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'underscore'
deepMerge = require 'lodash/merge'

helpers =

  wrapComponent: (component) ->
    cache = {}

    render: (DOMNode, props = {}) ->
      cache.DOMNode = DOMNode
      cache.component = ReactDOM.render React.createElement(component, props), DOMNode

      cache.component

    update: (props = {}) ->
      props = deepMerge({}, cache.component.props, props)
      ReactDOM.render React.createElement(component, props), cache.DOMNode

    unmount: ->
      ReactDOM.unmountComponentAtNode(cache.DOMNode)

module.exports = helpers
