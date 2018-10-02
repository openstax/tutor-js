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
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
    options: React.PropTypes.object
    store: React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired
    renderItem: React.PropTypes.func.isRequired
    isLoadingOrLoad: React.PropTypes.func
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

    propsToCheck = ['id', 'store', 'load', 'actions', 'options']
    _.isEqual(_.pick(prevProps, propsToCheck), _.pick(nextProps, propsToCheck))

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

  _isLoadingOrLoad: ->
    {id, options, store} = @props
    # if id is undefined, render as loading. loadableItem is waiting for id to be retrieved.
    return true unless id?

    switch
      when _.isEmpty(id)            then true
      when store.get(id, options)   then false
      when @isLoading(id, options)  then true
      when @isLoaded(id, options)   then false
      when (store.isUnknown(id, options) or store.reload(id, options)) then true
      else
        false

  isLoadingOrLoad: (args...) ->
    {id, options, store, isLoadingOrLoad} = @props

    isLoadingOrLoad ?= @_isLoadingOrLoad
    isLoadingOrLoad(args...)

  render: ->
    { id, renderItem, store} = @props

    propsForLoadable = _.pick(@props, 'store', 'update', 'bindEvent', 'renderLoading', 'renderError')

    <Loadable
      {...propsForLoadable}
      isLoading={@isLoadingOrLoad}
      isLoaded={_.partial(@isLoaded, id)}
      isFailed={_.partial(store.isFailed, id)}
      render={renderItem}
    />
