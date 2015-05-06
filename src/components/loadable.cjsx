React = require 'react'

BindStoreMixin = require './bind-store-mixin'

# This component is useful for viewing something that needs to be loaded.
#
# - display 'Loading...', 'Error', or the actual rendered component
# - automatically listens to changes in the appropriate store to re-render
# - calls `load` to fetch the latest version of the component when initially mounted

module.exports = React.createClass
  displayName: 'Loadable'
  propTypes:
    render: React.PropTypes.func.isRequired
    saved: React.PropTypes.func
    store: React.PropTypes.object.isRequired
    isLoading: React.PropTypes.func.isRequired
    isLoaded: React.PropTypes.func.isRequired
    isFailed: React.PropTypes.func.isRequired

  mixins: [BindStoreMixin]

  bindStore: ->
    @props.store

  bindUpdate: -> @props.update?() or @setState({})
  
  render: ->
    {isLoading, isLoaded, isFailed, render} = @props

    if isLoading()
      <div className='-loading'>Loading...</div>
    else if isLoaded()
      render()
    else if isFailed()
      <div className='-error'>Error Loading</div>
    else
      <div className='-bug'>Error Loading (Bug: Invalid State)</div>
