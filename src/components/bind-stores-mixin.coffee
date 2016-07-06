_ = require 'underscore'

module.exports =

  # can modify which event you want to bind on as needed.
  _defaultEvent: 'change'

  _defaultUpdate: ->
    @forceUpdate()

  _addListener: (bind) ->
    bind.store.on(bind.listenTo or @_defaultEvent, bind.callback or @_defaultUpdate)

  _removeListener:  (bind) ->
    bind.store.off(bind.listenTo or @_defaultEvent, bind.callback or @_defaultUpdate)

  _addListeners: ->
    bindEvents = @_getBindEvents?()
    return if _.isEmpty(bindEvents)
    _.each bindEvents, @_addListener

  _removeListeners: ->
    bindEvents = @_getBindEvents?()
    return if _.isEmpty(bindEvents)
    _.each bindEvents, @_removeListener

  componentWillMount:   -> @_addListeners()
  componentWillUnmount: -> @_removeListeners()
