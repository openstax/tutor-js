React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

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

  getInitialState: ->
    refreshButton: false

  getDefaultProps: ->

    # Enables a renderStatus prop function with a component other than a div
    renderLoading: (refreshButton) ->
      <div className='loading'>Loading... {refreshButton('refresh-button-delayed')}</div>

    renderError: (refreshButton) ->
      <div className='error'>Error Loading. {refreshButton('refresh-button')}</div>

    renderBug: ->
      <div className='bug'>Error Loading (Bug: Invalid State)</div>

  mixins: [BindStoreMixin]

  bindStore: ->
    @props.store

  bindUpdate: -> @props.update?() or @setState({})

  refreshButton: (type) ->
    if React?
      <div className="#{type}">
        <BS.Button onClick={@reloadPage}>
          Please Refresh
        </BS.Button>
      </div>
    else
      <div className="#{type}">
        <a href="#" onClick={@reloadPage}>
          Please Refresh
        </a>
      </div>

  reloadPage: ->
    location.reload()

  render: ->
    {isLoading, isLoaded, isFailed, render, renderLoading, renderError, renderBug} = @props

    if isLoading()
      renderLoading(@refreshButton)
    else if isLoaded()
      render()
    else if isFailed()
      renderError(@refreshButton)
      
    else
      render()
