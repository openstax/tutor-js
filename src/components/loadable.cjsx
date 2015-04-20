React = require 'react'

# This component is useful for viewing something that needs to be loaded.
#
# - display "Loading...", "Error", or the actual rendered component
# - automatically listens to changes in the appropriate store to re-render
# - calls `load` to fetch the latest version of the component when initially mounted

module.exports = React.createClass
  displayName: 'Loadable'
  propTypes:
    render: React.PropTypes.func.isRequired
    update: React.PropTypes.func
    store: React.PropTypes.object.isRequired
    isLoading: React.PropTypes.func.isRequired
    isLoaded: React.PropTypes.func.isRequired
    isFailed: React.PropTypes.func.isRequired

  _addListener: ->
    {store} = @props
    store.addChangeListener(@_update)

  _removeListener: ->
    {store} = @props
    store.removeChangeListener(@_update)

  componentWillMount:   -> @_addListener()
  componentWillUnmount: -> @_removeListener()

  # The following fixs an invariant violation when switching screens
  componentWillUpdate: -> @_removeListener()
  componentDidUpdate:  -> @_addListener()

  _update: -> @props.update?() or @setState({})

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
