# Store for api requests and responses
_ = require 'underscore'
moment = require 'moment-timezone'

{makeSimpleStore} = require './helpers'

AppConfig =
  _statuses: []
  _pending: []

  _getBareOpts: (opts) ->
    _.pick(opts, 'method', 'data')

  _getDuration: (request) ->
    moment().diff(request.sendMoment)

  _getServerStatus: (statusCode, message, requestDetails) ->
    {url, opts} = requestDetails
    sparseOpts = @_getBareOpts(opts)
    request = {url, opts: sparseOpts}

    {statusCode, message, request}

  _getRequestInfo: (requestConfig) ->
    sparseOpts = @_getBareOpts(requestConfig)

    requestIndex = _.findLastIndex(@_pending, sparseOpts)

    return null unless requestIndex

    request: @_pending[requestIndex]
    requestIndex: requestIndex

  queRequest: (requestConfig) ->
    sparseOpts = @_getBareOpts(requestConfig)
    sparseOpts.sendMoment = moment()
    @_pending.push(sparseOpts)

  _unqueRequestAtIndex: (requestIndex) ->
    @_pending.splice(requestIndex, 1)

  unqueRequest: (request) ->
    requestIndex = _.findLastIndex(@_pending, request)
    @_unqueRequestAtIndex(requestIndex)

  updateForResponse: (statusCode, message, requestDetails) ->
    {opts} = requestDetails

    status = AppConfig._getServerStatus statusCode, message, requestDetails

    # try to get request from pending info, remove from pending, and calc response time
    requestInfo = @_getRequestInfo(opts)
    if requestInfo
      {request, requestIndex} = requestInfo
      @_unqueRequestAtIndex(requestIndex)
      status.responseTime = @_getDuration(request)

    @_statuses.push(status)
    status

  setServerError: (statusCode, message, requestDetails) ->
    {opts} = requestDetails
    return unless opts.displayError

    status = @updateForResponse statusCode, message, requestDetails
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
