React = require 'react'
BS = require 'react-bootstrap'

BindStoreMixin = require './bind-store-mixin'
RefreshButton = require './buttons/refresh-button'

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
    isLong: React.PropTypes.bool

  getDefaultProps: ->

    # Enables a renderStatus prop function with a component other than a div
    renderLoading: (refreshButton, isLong = false) ->
      loadableClasses = 'loadable is-loading'
      loadableClasses += ' loadable-long' if isLong

      <div className={loadableClasses}>Loading... {refreshButton}</div>

    renderError: (refreshButton, isLong = false) ->
      loadableClasses = 'loadable is-error'
      loadableClasses += ' loadable-long' if isLong

      <div className={loadableClasses}>Error Loading. {refreshButton}</div>

    isLong: false

  mixins: [BindStoreMixin]

  bindStore: ->
    @props.store

  bindUpdate: -> @props.update?() or @setState({})

  render: ->
    {isLoading, isLoaded, isFailed, render, renderLoading, renderError, isLong} = @props

    refreshButton = <RefreshButton />

    if isLoading()
      renderLoading(refreshButton, isLong)
    else if isLoaded()
      render()
    else if isFailed()
      renderError(refreshButton, isLong)

    else
      render()
