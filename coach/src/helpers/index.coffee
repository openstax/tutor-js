React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'underscore'

helpers =

  wrapComponent: (component) ->
    cachedDOMNode = null

    render: (DOMNode, props = {}) ->
      cachedDOMNode = DOMNode
      ReactDOM.render React.createElement(component, props), DOMNode

    update: (props = {}) ->
      ReactDOM.render React.createElement(component, props), cachedDOMNode

    unmountFrom: ReactDOM.unmountComponentAtNode

module.exports = helpers
