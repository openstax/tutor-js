React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'underscore'
deepMerge = require 'lodash/merge'

{AppContainer} = require 'react-hot-loader'

helpers =

  wrapComponent: (component) ->
    cache = {}

    render: (DOMNode, @props = {}) ->
      cache.DOMNode = DOMNode
      cache.component =
        ReactDOM.render(
          React.createElement(AppContainer, {}, React.createElement(component, @props))
          DOMNode
        )
      cache.component

    update: (props = {}) ->
      deepMerge(@props, props)
      ReactDOM.render(
        React.createElement(AppContainer, {}, React.createElement(component, @props))
        cache.DOMNode
      )

    unmount: ->
      ReactDOM.unmountComponentAtNode(cache.DOMNode)

module.exports = helpers
