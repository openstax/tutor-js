React = require 'react'
{RouteHandler} = require 'react-router'


# idea from https://gist.github.com/gaearon/fbd581089255cd529e62

# This renders a simple loading message while webpack loads the code
# and then displays the component that was exported
createAsyncHandler = (getHandlerAsync, exportedObjectName) ->

  React.createClass
    displayName: 'WebPackAsyncLoader'

    componentWillMount: ->
      getHandlerAsync().then (resolvedHandler) =>
        @setState(component: resolvedHandler[exportedObjectName])

    render: ->
      if @state?.component
        React.createElement(@state.component, @props)
      else
        React.createElement('h1', 'Loading...' )


module.exports = createAsyncHandler
