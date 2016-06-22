# Store for api requests and responses
_ = require 'underscore'
moment = require 'moment-timezone'

{makeSimpleStore} = require './helpers'

AppConfig =
  _statuses: []
  _pending: []

  _getRequestOpts: (opts) ->
    opts = _.pick(opts, 'method', 'data', 'url')
    opts = _.omit(opts, 'data') unless opts.data
    opts

  _getDuration: (request) ->
    moment().diff(request.sendMoment)

  _getServerStatus: (statusCode, message, requestDetails) ->
    request = @_getRequestOpts(requestDetails)

    {statusCode, message, request}

  _findPendingIndex: (request) ->
    sparseRequest = @_getRequestOpts(request)
    _.findLastIndex @_pending, (pending) =>
      _.isEqual @_getRequestOpts(pending), sparseRequest

  _getRequestInfo: (requestConfig) ->
    sparseOpts = @_getRequestOpts(requestConfig)

    requestIndex = @_findPendingIndex(sparseOpts)

    return null unless requestIndex > -1

    request: @_pending[requestIndex]
    requestIndex: requestIndex

  queRequest: (requestConfig) ->
    request = @_getRequestOpts(requestConfig)
    request.sendMoment = moment()
    @_pending.push(request)

  _unqueRequestAtIndex: (requestIndex) ->
    @_pending.splice(requestIndex, 1)

  unqueRequest: (request) ->
    requestIndex = @_findPendingIndex(request)
    @_unqueRequestAtIndex(requestIndex)

  updateForResponse: (statusCode, message, requestDetails) ->
    status = AppConfig._getServerStatus statusCode, message, requestDetails

    # try to get request from pending info, remove from pending, and calc response time
    requestInfo = @_getRequestInfo(requestDetails)

    if requestInfo
      {request, requestIndex} = requestInfo
      @_unqueRequestAtIndex(requestIndex)
      status.responseTime = @_getDuration(request)

    @_statuses.push(status)
    status

  setServerError: (statusCode, message, requestDetails) ->
    status = @updateForResponse statusCode, message, requestDetails

    {displayError} = requestDetails
    return unless displayError
    @_currentServerError = status
    @emit('server-error', statusCode, message)

  setServerSuccess: (statusCode, message, requestDetails) ->
    status = @updateForResponse statusCode, message, requestDetails
    @_currentServerSuccess = status

    @emit('server-success', statusCode, message)

  reset: ->
    @_statuses = []
    @_pending = []
    @_currentServerSuccess = {}
    @_currentServerError = {}

  exports:
    getError: -> @_currentServerError
    getStatus: -> _.last(@_statuses)
    get: ->
      pending: @_pending
      statuses: @_statuses

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
