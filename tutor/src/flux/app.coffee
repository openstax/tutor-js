# Store for api requests and responses
_ = require 'underscore'
hash = require 'object-hash'
moment = require 'moment-timezone'

getRequestHash = _.partial(hash, _, {unorderedArrays: true})
{makeSimpleStore} = require './helpers'

AppConfig =
  _statuses: []
  _pending: {}
  _cache: {}

  resetServerErrors: ->
    delete @_currentServerError

  _getRequestOpts: (opts) ->
    opts = _.pick(opts, 'method', 'data', 'url')
    opts = _.omit(opts, 'data') unless opts.data
    opts

  _getDuration: (request) ->
    moment().diff(request.sendMoment)

  _getServerStatus: (statusCode, message, requestDetails) ->
    request = @_getRequestOpts(requestDetails)

    {statusCode, message, request}

  _cacheByKey: (requestHashKey, request) ->
    @_cache[requestHashKey] ?= []
    @_cache[requestHashKey].push(request)

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

  unqueRequest: (request) ->
    requestHashKey = @_getPendingHashKey(request)
    @_unqueRequestAtHashKey(requestHashKey)

  updateForResponse: (statusCode, message, requestDetails) ->
    status = @_getServerStatus statusCode, message, requestDetails

    # try to get request from pending info, remove from pending, and calc response time
    requestInfo = @_getPendingInfo(requestDetails)

    if requestInfo
      {request, requestHashKey} = requestInfo
      status.responseTime = @_getDuration(request)

      @_cacheByKey(requestHashKey, status)
      @_unqueRequestAtHashKey(requestHashKey)

    @_statuses.push(status)
    status

  setServerError: (statusCode, message, requestDetails) ->
    return unless requestDetails.displayError

    @_currentServerError = @getRequestStatus requestDetails
    @emit('server-error', statusCode, message)

  setServerSuccess: (statusCode, message, requestDetails) ->
    @_currentServerSuccess = @getRequestStatus requestDetails
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
