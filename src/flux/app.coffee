# Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'

{makeSimpleStore} = require './helpers'

AppConfig =
  _counts: {}

  setServerError: (statusCode, message, requestDetails) ->
    @_currentServerError = {statusCode, message, requestDetails}
    @_counts[requestDetails.url] ?= 0
    @_counts[requestDetails.url] = @_counts[requestDetails.url] + 1
    @emit('server-error', statusCode, message, requestDetails)

  clearError: ->
    @_counts[@_currentServerError.requestDetails.url] = null
    @_currentServerError = null

  exports:
    getError: -> @_currentServerError

    isOnce: (url) ->
      @_counts[@_currentServerError.requestDetails.url] < 2

{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppActions:actions, AppStore:store}
