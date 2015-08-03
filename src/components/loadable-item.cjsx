React = require 'react'
Loadable = require './loadable'
_ = require 'underscore'

# This component is useful for viewing a single Object from the Backend (ie Task, TaskPlan).
# It uses methods defined in `CrudConfig` (maybe that should be renamed) to:
#
# - display 'Loading...', 'Error', or the actual rendered component
# - automatically listens to changes in the appropriate store to re-render
# - calls `load` to fetch the latest version of the component when initially mounted

module.exports = React.createClass
  displayName: 'LoadableItem'
  propTypes:
    id: React.PropTypes.string.isRequired
    options: React.PropTypes.object
    store: React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired
    renderItem: React.PropTypes.func.isRequired
    saved: React.PropTypes.func
    load: React.PropTypes.func
    renderLoading: React.PropTypes.func
    renderError: React.PropTypes.func
    update: React.PropTypes.func

  componentDidMount: -> @reload({})
  componentDidUpdate: (oldProps) -> @reload(oldProps)

  reload: (oldProps) ->
    {id, store, load, actions, options} = @props
    return unless id?

    # Skip reloading if all the props are the same (the case in the Calendar for some reason)
    return if oldProps.id is id and oldProps.store is store and oldProps.actions is actions and
      oldProps.load is load and _.isEqual(oldProps.options, options)

    load ?= actions.load
    unless store.isNew(id, options)
      load(id, options)

  render: ->
    { id, store, actions, load, isLoaded, isLoading, renderItem,
      saved, renderLoading, renderError, renderBug, update, options} = @props

    load ?= actions.load
    isLoaded ?= store.isLoaded
    isLoading ?= store.isLoading

    isLoadingOrLoad = ->
      # if id is undefined, render as loading. loadableItem is waiting for id to be retrieved.
      return true unless id?

      if store.get(id, options)
        false
      else if isLoading(id, options)
        true
      else if isLoaded(id, options)
        false
      else if store.isUnknown(id, options) or store.reload(id, options)
        true
      else if store.isNew(id, options) and store.get(id, options).id and saved
        # If this store was just created, then call the onSaved prop
        saved()
      else
        false

    renderModes = {renderLoading, renderError, renderBug}

    <Loadable
      store={store}
      isLoading={isLoadingOrLoad}
      isLoaded={-> isLoaded(id)}
      isFailed={-> store.isFailed(id)}
      render={renderItem}
      renderLoading={renderLoading}
      update={update}
      {renderModes}
    />
