_ = require 'underscore'

module.exports =

  # can modify which event you want to bind on as needed.
  _defaultEvent: 'change'

  _defaultUpdate: ->
    @forceUpdate()

  _addListener: ({store, listenTo, callback}) ->
    store.on(listenTo or @_defaultEvent, callback or @_defaultUpdate)

  _removeListener:  ({store, listenTo, callback}) ->
    store.off(listenTo or @_defaultEvent, callback or @_defaultUpdate)

  _addListeners: ->
    bindEvents = @getBindEvents?()
    return if _.isEmpty(bindEvents)
    _.each bindEvents, @_addListener

  _removeListeners: ->
    bindEvents = @getBindEvents?()
    return if _.isEmpty(bindEvents)
    _.each bindEvents, @_removeListener

  componentWillMount:   -> @_addListeners()
  componentWillUnmount: -> @_removeListeners()
