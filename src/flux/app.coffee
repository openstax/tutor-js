# Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'
_ = require 'underscore'

{makeSimpleStore} = require './helpers'

getErrorId = (error) ->
  "#{error?.request?.opts?.method}#{error?.request?.url}"

shouldRetrigger = (error) ->
  400 <= error.statusCode < 500

RETRIGGER_ERROR_DELAY = 0

AppConfig =
  _retriggered: {}
  _triggers: {}

  setServerError: (statusCode, message, requestDetails, triggerAction) ->
    {url, opts} = requestDetails
    sparseOpts = _.pick(opts, 'method', 'data')
    request = {url, opts: sparseOpts}
    @_currentServerError = {statusCode, message, request}

    id = getErrorId(@_currentServerError)

    @_triggers[id] = triggerAction if @_isRetriggable(id)

    @emit('server-error', statusCode, message)

  retriggered: (id) ->
    @_retriggered[id] = true
    # make extra sure to remove trigger.
    delete @_triggers[id]

  retriggerOnce: (id) ->
    if @_isRetriggable(id)
      # retrigger, with delay if needed.
      _.delay(@_triggers[id], RETRIGGER_ERROR_DELAY)
      # and mark as retriggered
      @retriggered(id)

  resetError: (id) ->
    @_triggers[id] = null
    @_retriggered[id] = null
    @_currentServerError = null

  _isRetriggable: (id) ->
    shouldRetrigger(@_currentServerError) and not (@_retriggered[id]? and @_retriggered[id])

  exports:
    getError: -> @_currentServerError

    getCurrentErrorId: ->
      getErrorId(@_currentServerError)

    isRetriggable: (id) ->
      @_isRetriggable(id)

{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppActions:actions, AppStore:store}
