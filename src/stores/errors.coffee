_ = require 'underscore'
flux = require 'flux-react'

{makeSimpleStore} = require './helpers'

ErrorsConfig = {



  setServerError: (statusCode, message, requestDetails) ->
    {url, opts} = requestDetails

    sparseOpts = _.pick(opts, 'method', 'data')
    request = {url, opts: sparseOpts}
    @_currentServerError = {statusCode, message, request}

    @emit('change')

  acknowledge: ->
    delete @_currentServerError
    @emit('change')

  exports:
    getError: -> @_currentServerError



}

{actions, store} = makeSimpleStore(ErrorsConfig)
module.exports = {ErrorsActions:actions, ErrorsStore:store}
