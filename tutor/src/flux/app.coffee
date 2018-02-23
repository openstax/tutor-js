# Store for api requests and responses
_ = require 'underscore'

{makeSimpleStore} = require './helpers'


AppConfig =
  resetServerErrors: ->
    delete @_currentServerError

  setServerError: (errorResponse) ->
    {status, data} = errorResponse
    @_currentServerError = errorResponse
    @emit('server-error', status, data)

  exports:
    getError: -> @_currentServerError
    errorNavigation: ->
      return {} unless @_currentServerError
      {status, request} = @_currentServerError
      if status is 403
        {href: '/'}
      else
        isGET404 = status is 404 and request.method is 'GET'
        isInRange = 400 <= status < 600
        {shouldReload: false}

{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppActions:actions, AppStore:store}
