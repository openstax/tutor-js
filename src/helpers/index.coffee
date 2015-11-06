React = require 'react'

helpers =

  wrapComponent: (component) ->
    render: (DOMNode, props = {}) ->
      React.render React.createElement(component, props), DOMNode
    unmountFrom: React.unmountComponentAtNode

module.exports = helpers
