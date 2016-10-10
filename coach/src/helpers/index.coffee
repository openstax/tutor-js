React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'underscore'

helpers =

  wrapComponent: (component) ->
    render: (DOMNode, props = {}) ->
      ReactDOM.render React.createElement(component, props), DOMNode
    unmountFrom: ReactDOM.unmountComponentAtNode

module.exports = helpers
