React = require 'react'

# This mixin is useful for viewing a single Object from the Backend (ie Task, TaskPlan).
# It uses methods defined in `CrudConfig` (maybe that should be renamed) to:
#
# - display "Loading...", "Error", or the actual rendered component
# - automatically listens to changes in the appropriate store to re-render
# - calls `load` to fetch the latest version of the component when initially mounted
#
# Classes using this mixin must define `getFlux` and `renderLoaded`

module.exports =
  # getFlux: -> {store, actions}
  # getId: -> id Optional
  # renderLoaded: ->

  componentWillMount: ->
    {store} = @getFlux()
    store.addChangeListener(@_update)
  componentWillUnmount: ->
    {store} = @getFlux()
    store.removeChangeListener(@_update)

  _update: -> @update?() or @setState({})

  _getId: ->
    if @getId?
      @getId()
    else
      @getParams().id or throw new Error('BUG: id is required')

  render: ->
    {store, actions} = @getFlux()
    id = @_getId()

    if store.isUnknown(id)
      # The load is done here because otherwise it would need to be in `componentWillMount`
      # **and** componentWillUpdate(nextProps) making the API a bit more clunky
      # since `@getId()` would need to take an optional `nextProps`.
      unless store.isNew(id)
        actions.load(id)
      <div className="-loading">Loading Started...</div>
    else if store.isLoading(id)
      <div className="-loading">Loading...</div>
    else if store.isLoaded(id)
      @renderLoaded()
    else
      <div className="-error">Error Loading</div>
