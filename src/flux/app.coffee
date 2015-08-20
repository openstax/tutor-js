# Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'
_ = require 'underscore'

{makeSimpleStore} = require './helpers'


shouldReload = (error) ->
  {statusCode, request} = error
  isGET404 = statusCode is 404 and request.method is 'GET'
  isInRange = 400 <= statusCode < 600
  isInRange and not isGET404


AppConfig =

  setServerError: (statusCode, message, requestDetails) ->
    {url, opts} = requestDetails
    sparseOpts = _.pick(opts, 'method', 'data')
    request = {url, opts: sparseOpts}
    @_currentServerError = {statusCode, message, request}

    @emit('server-error', statusCode, message)


  exports:
    getError: -> @_currentServerError
    shouldReload: ->
      shouldReload(@_currentServerError)


{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppActions:actions, AppStore:store}
