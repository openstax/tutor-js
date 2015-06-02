React = require 'react'
BS = require 'react-bootstrap'

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
    renderLoading: React.PropTypes.func.isRequired
    renderError: React.PropTypes.func.isRequired
    renderBug: React.PropTypes.func.isRequired

  getDefaultProps: ->

    # Enables a renderStatus prop function with a component other than a div
    renderLoading: ->
      <div className='loading'>Loading... <RefreshButton /></div>

    renderError: ->
      <div className='error'>Error Loading. <RefreshButton /></div>

    renderBug: ->
      <div className='bug'>Error Loading (Bug: Invalid State)</div>

  mixins: [BindStoreMixin]

  bindStore: ->
    @props.store

  bindUpdate: -> @props.update?() or @setState({})

  render: ->
    {isLoading, isLoaded, isFailed, render, renderLoading, renderError, renderBug} = @props

    if isLoading()
      renderLoading()
    else if isLoaded()
      render()
    else if isFailed()
      renderError()
      
    else
      render()


RefreshButton = React.createClass
  displayName: 'RefreshButton'

  render: ->
    <div className="refresh-button">
      <a href={window.location}>Please Refresh</a>
    </div>
