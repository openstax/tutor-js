React = require 'react'

module.exports =
  # getFlux: -> {store, actions}
  # getId: -> id Optional
  # renderLoaded: ->

  componentWillMount: ->
    {store, actions} = @getFlux()
    id = @_getId()
    unless store.isNew(id)
      actions.load(id)
    store.addChangeListener(@_update)
  componentWillUnmount: ->
    {store} = @getFlux()
    store.removeChangeListener(@_update)

  _update: -> @update?() or @setState({})

  _getId: -> @getId?() or @getParams().id or throw new Error('BUG: id is required')

  render: ->
    {store, actions} = @getFlux()
    id = @_getId()

    if store.isUnknown(id)
      throw new Error('BUG: should never be Unknown by this point')
    else if store.isLoading(id)
      <div className="-loading">Loading...</div>
    else if store.isLoaded(id)
      @renderLoaded()
    else
      <div className="-error">Error Loading</div>
