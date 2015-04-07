React = require 'react'
Loadable = require './loadable'

# This component is useful for viewing a single Object from the Backend (ie Task, TaskPlan).
# It uses methods defined in `CrudConfig` (maybe that should be renamed) to:
#
# - display "Loading...", "Error", or the actual rendered component
# - automatically listens to changes in the appropriate store to re-render
# - calls `load` to fetch the latest version of the component when initially mounted

module.exports = React.createClass
  displayName: 'LoadableItem'
  propTypes:
    id: React.PropTypes.string.isRequired
    store: React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired
    renderItem: React.PropTypes.func.isRequired
    update: React.PropTypes.func
    load: React.PropTypes.func

  render: ->
    {id, store, actions, load, isLoaded, isLoading, renderItem} = @props
    load ?= actions.load
    isLoaded ?= store.isLoaded
    isLoading ?= store.isLoading

    isLoadingOrLoad = ->
      if isLoading(id)
        true
      else if isLoaded(id)
        false
      else if store.isUnknown(id)
        # The load is done here because otherwise it would need to be in `componentWillMount`
        # **and** componentWillUpdate(nextProps) making the API a bit more clunky
        unless store.isNew(id)
          load(id)
        true
      else
        false

    <Loadable
      store={store}
      isLoading={isLoadingOrLoad}
      isLoaded={-> isLoaded(id)}
      isFailed={-> store.isFailed(id)}
      render={renderItem}
    />
