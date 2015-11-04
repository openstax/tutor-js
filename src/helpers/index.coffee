React = require 'react'

helpers =

  wrapComponent: (component) ->
    (DOMNode, props = {}) ->
      React.render React.createElement(component, props), DOMNode


module.exports = helpers
