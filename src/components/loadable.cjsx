React = require 'react'

# This component is useful for viewing something that needs to be loaded.
#
# - display "Loading...", "Error", or the actual rendered component
# - automatically listens to changes in the appropriate store to re-render
# - calls `load` to fetch the latest version of the component when initially mounted

delay = (fn) -> setTimeout(fn, 50)

module.exports = React.createClass
  displayName: 'Loadable'
  propTypes:
    render: React.PropTypes.func.isRequired
    saved: React.PropTypes.func
    store: React.PropTypes.object.isRequired
    isLoading: React.PropTypes.func.isRequired
    isLoaded: React.PropTypes.func.isRequired
    isFailed: React.PropTypes.func.isRequired

  componentWillMount: ->
    {store} = @props
    store.addChangeListener(@_update)
  componentWillUnmount: ->
    {store} = @props
    store.removeChangeListener(@_update)

  _update: ->
    debugger
    delay => @setState({})

  render: ->
    {isLoading, isLoaded, isFailed, render} = @props

    if isLoading()
      <div className="-loading">Loading...</div>
    else if isLoaded()
      render()
    else if isFailed()
      <div className="-error">Error Loading</div>
    else
      <div className="-bug">Error Loading (Bug: Invalid State)</div>
