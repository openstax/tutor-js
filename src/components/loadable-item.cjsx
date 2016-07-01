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
    isLoadingOrLoad: React.PropTypes.func
    saved: React.PropTypes.func
    load: React.PropTypes.func
    renderLoading: React.PropTypes.func
    renderError: React.PropTypes.func
    update: React.PropTypes.func
    bindEvent: React.PropTypes.string

  getDefaultProps: ->
    bindEvent: 'change'

  componentWillMount: ->
    {id, store, options} = @props
    @load(id, options) if id? and not store.isNew(id, options)

  componentWillReceiveProps: (nextProps) ->
    @reload(@props, nextProps)

  arePropsSame: (prevProps, nextProps) ->
    {id, store, load, actions, options} = nextProps

    prevProps.id is id and
      prevProps.store is store and
      prevProps.actions is actions and
      prevProps.load is load and
      _.isEqual(prevProps.options, options)

  reload: (prevProps, nextProps) ->
    {id, store, load, actions, options} = nextProps
    return unless id?

    # Skip reloading if all the props are the same (the case in the Calendar for some reason)
    return if @arePropsSame(prevProps, nextProps)
    @load(id, options) unless store.isNew(id, options)

  load: (args...) ->
    {load, actions} = @props
    load ?= actions.load
    load(args...)

  isLoaded: (args...) ->
    {isLoaded, store} = @props
    isLoaded ?= store.isLoaded
    isLoaded(args...)

  isLoading: (args...) ->
    {isLoading, store} = @props
    isLoading ?= store.isLoading
    isLoading(args...)

  isLoadingOrLoad: ->
    {id, options, saved, store} = @props

    # if id is undefined, render as loading. loadableItem is waiting for id to be retrieved.
    return true unless id?

    if store.get(id, options)
      false
    else if @isLoading(id, options)
      true
    else if @isLoaded(id, options)
      false
    else if store.isUnknown(id, options) or store.reload(id, options)
      true
    else if store.isNew(id, options) and store.get(id, options).id and saved
      # If this store was just created, then call the onSaved prop
      saved()
    else
      false

  render: ->
    { id, isLoadingOrLoad, renderItem, store} = @props

    propsForLoadable = _.pick(@props, 'store', 'update', 'bindEvent', 'renderLoading', 'renderError')
    isLoadingOrLoad ?= @isLoadingOrLoad

    <Loadable
      {...propsForLoadable}
      isLoading={isLoadingOrLoad}
      isLoaded={_.partial(@isLoaded, id)}
      isFailed={_.partial(store.isFailed, id)}
      render={renderItem}
    />
