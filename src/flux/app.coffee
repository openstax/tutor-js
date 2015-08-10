# Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'

{makeSimpleStore} = require './helpers'

AppConfig =

  setServerError: (statusCode, message) ->
    @_currentServerError = {statusCode, message}
    @emit('server-error', statusCode, message)

  clearError: ->
    @_currentServerError = null

  exports:
    getError: -> @_currentServerError

{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppActions:actions, AppStore:store}
