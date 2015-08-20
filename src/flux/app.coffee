# Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'
_ = require 'underscore'

{makeSimpleStore} = require './helpers'

AppConfig =
  _retriggered: {}
  _triggers: {}

  setServerError: (statusCode, message, requestDetails, triggerAction) ->
    {url, opts} = requestDetails

    sparseOpts = _.pick(opts, 'method', 'data')
    request = {url, opts: sparseOpts}

    @_currentServerError = {statusCode, message, request}

    @_triggers[url] = triggerAction unless @_retriggered[url]

    @emit('server-error', statusCode, message)

  retriggered: (url) ->
    @_retriggered[url] = true
    delete @_triggers[url]

  retriggerOnce: (url) ->
    unless @_retriggered[url]
      # retrigger
      @_triggers[url]?()
      # and mark as retriggered
      @retriggered(url)

  resetError: (url) ->
    @_triggers[url] = null
    @_retriggered[url] = null
    @_currentServerError = null

  clearError: ->
    @_currentServerError = null

  exports:
    getError: -> @_currentServerError

    canRetrigger: (url) ->
      not @_retriggered[url]

{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppActions:actions, AppStore:store}
