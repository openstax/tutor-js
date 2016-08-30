# Store for api requests and responses
_ = require 'underscore'
hash = require 'object-hash'
moment = require 'moment-timezone'

{makeSimpleStore} = require './helpers'

getRequestHash = _.partial(hash, _, {unorderedArrays: true})

AppConfig =
  _statuses: []
  _pending: {}
  _cache: {}

  resetServerErrors: ->
    delete @_currentServerError

  _getRequestOpts: (opts) ->
    opts = _.pick(opts, 'method', 'data', 'url')
    opts = _.omit(opts, 'data') if _.isEmpty(opts.data)
    opts

  _getDuration: (status) ->
    moment().diff(status.sendMoment)

  _formatServerResponse: (statusCode, message, requestConfig) ->
    request = @_getRequestOpts(requestConfig)

    unless _.isObject(message)
      try
        message = JSON.parse(message)
      catch e

    {statusCode, message, request}

  _cacheByKey: (requestHashKey, status) ->
    @_cache[requestHashKey] ?= []
    @_cache[requestHashKey].push(status)

  getRequestStatus: (requestConfig) ->
    requestHashKey = @_getPendingHashKey(requestConfig)
    _.last(@_cache[requestHashKey])

  _getPendingHashKey: (requestConfig) ->
    request = @_getRequestOpts(requestConfig)
    getRequestHash(request)

  _getPendingInfo: (requestConfig) ->
    requestHashKey = @_getPendingHashKey(requestConfig)
    return null unless @_pending[requestHashKey]?

    request: @_pending[requestHashKey]
    requestHashKey: requestHashKey

  queRequest: (requestConfig) ->
    request = @_getRequestOpts(requestConfig)
    requestHashKey = getRequestHash(request)

    request.sendMoment = moment()
    @_cacheByKey(requestHashKey, request)
    @_pending[requestHashKey] = request

  _unqueRequestAtHashKey: (requestHashKey) ->
    delete @_pending[requestHashKey]

  unqueRequest: (requestConfig) ->
    requestHashKey = @_getPendingHashKey(requestConfig)
    @_unqueRequestAtHashKey(requestHashKey)

  updateForResponse: (statusCode, message, requestConfig) ->
    status = @_formatServerResponse statusCode, message, requestConfig

    # try to get request from pending info, remove from pending, and calc response time
    requestInfo = @_getPendingInfo(requestConfig)

    if requestInfo
      {request, requestHashKey} = requestInfo
      status.responseTime = @_getDuration(request)

      @_unqueRequestAtHashKey(requestHashKey)
    else
      requestHashKey = @_getPendingHashKey(requestConfig)

    @_cacheByKey(requestHashKey, status)
    @_statuses.push(status)
    status

  setServerError: (statusCode, message, requestConfig) ->
    return unless requestConfig.displayError

    @_currentServerError = @getRequestStatus requestConfig
    @emit('server-error', statusCode, message)

  setServerSuccess: (statusCode, message, requestConfig) ->
    @_currentServerSuccess = @getRequestStatus requestConfig
    @emit('server-success', statusCode, message)

  reset: ->
    @_statuses = []
    @_pending = {}
    @_cache = {}
    @_currentServerSuccess = {}
    @_currentServerError = {}

  exports:
    getError: -> @_currentServerError
    getStatus: -> _.last(@_statuses)
    get: ->
      pending: @_pending
      statuses: @_statuses

    isPending: (requestConfig) ->
      @_getPendingInfo(requestConfig)?

    errorNavigation: ->
      return {} unless @_currentServerError
      {statusCode, request} = @_currentServerError
      if statusCode is 403
        {href: '/'}
      else
        isGET404 = statusCode is 404 and request.method is 'GET'
        isInRange = 400 <= statusCode < 600
        {shouldReload: isInRange and not isGET404}

{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppActions:actions, AppStore:store}
