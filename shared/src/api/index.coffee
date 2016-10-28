_ = require 'lodash'
{Promise} = require 'es6-promise'
axios = require 'axios'

interpolate = require 'interpolate'

# this is pretty terrible.
require 'extract-values'

EventEmitter2 = require 'eventemitter2'

{Routes, XHRRecords, utils} = require './collections'
{Interceptors} = require './interceptors'

{hashWithArrays, makeHashWith} = utils

API_DEFAULTS =
  request:
    delay: 0
  xhr:
    dataType: 'json'
  eventOptions:
    pattern: '{subject}.{topic}.{action}'
    send: 'send'
    receive: 'receive.{status}'
    statuses:
      success: 'success'
      failure: 'failure'
  events: []
  handlers:
    onSuccess: (response, args...) ->
      response
    onFail: (response, args...) ->
      Promise.reject(response)
  isLocal: false

setUpXHRInterceptors = (xhrInstance, interceptors, isLocal) ->
  # tell app that a request is pending.
  xhrInstance.interceptors.request.use(interceptors.queRequest)

  # modify request to use local stubs
  xhrInstance.interceptors.request.use(interceptors.makeLocalRequest) if isLocal

  # make sure app knows a response has been returned for a pending request,
  # for both successes and errors
  xhrInstance.interceptors.response.use(interceptors.setResponseReceived, interceptors.setErrorReceived)

  # broadcast response status
  xhrInstance.interceptors.response.use(interceptors.broadcastSuccess, interceptors.broadcastError)

  # modify response when using the local api stubs.
  xhrInstance.interceptors.response.use(interceptors.makeLocalResponse, interceptors.handleLocalErrors) if isLocal

  # on response, transform error as needed
  xhrInstance.interceptors.response.use(null, interceptors.handleError)
  xhrInstance.interceptors.response.use(null, interceptors.handleMalformedRequest)
  xhrInstance.interceptors.response.use(null, interceptors.handleNotFound)
  xhrInstance.interceptors.response.use(null, interceptors.handleErrorMessage)

makeRequestConfig = (routeOptions, routeData, postData) ->
  {pattern} = routeOptions

  requestConfig = _.omit(routeOptions, 'subject', 'topic', 'pattern', 'action', 'delay', 'onSuccess', 'onFail')
  requestConfig.url = interpolate(pattern, routeData)
  requestConfig.data = postData unless _.isEmpty(postData)
  requestConfig

DEFAULT_SUCCESS = (response) -> response
DEFAULT_FAIL = (response) -> Promise.reject(response)

class APIHandler
  constructor: (options, routes, channel) ->
    @setOptions(options)

    @initializeRoutes(routes)
    @initializeRecords()
    @initializeEventOptions(@getOptions().eventOptions, @getOptions().events)
    @initializeEvents(@getOptions().events, channel)
    @initializeXHR(@getOptions().xhr, new Interceptors(@getOptions().hooks, @), @getOptions().isLocal)

  destroy: =>
    @_channel.removeAllListeners()

  initializeRecords: =>
    @_records = new XHRRecords()

  initializeRoutes: (routes) =>
    @_routes = new Routes(routes)

  initializeXHR: (xhrOptions, interceptors) =>
    xhr = axios.create(xhrOptions)
    setUpXHRInterceptors(xhr, interceptors)

    @_xhr = xhr

  updateXHR: (xhrOptions) =>
    # notice that this is not deep -- for example, passings header through xhrOptions
    #   will override existing headers, not merge recursively.
    _.assign(@_xhr.defaults, xhrOptions)

  initializeEventOptions: (eventOptions, events) =>
    {pattern, send, receive, statuses} = eventOptions

    # {subject}.{topic}.{action}.send||(receive.(failure||success))
    patterns =
      base: pattern
      send: [pattern, send].join('.')
      receive: [pattern, receive].join('.')

    allEvents =
      subject: '*'
      topic: '*'
      action: '*'

    sendRequest = @sendRequest
    @_patterns = patterns
    @_statuses = statuses

    handleSend = (args...) ->
      requestInfo = extractValues(@event, patterns.send)
      sendRequest(requestInfo, args...)

    events.push([interpolate(patterns.send, allEvents), handleSend])

  initializeEvents: (events, channel) =>
    @_channel = channel or new EventEmitter2 wildcard: true
    _.forEach(events, _.spread(@_channel.on.bind(@_channel)))

  setOptions: (options) =>
    previousOptions = @getOptions?() or {}
    options = _.merge({}, API_DEFAULTS, previousOptions, options)

    @getOptions = -> options

  sendRequest: (requestInfo, routeData, postData, args...) =>
    routeOptions = @_routes.get(requestInfo)
    return unless routeOptions?

    requestConfig = makeRequestConfig(routeOptions, routeData, postData)
    return if @_records.isPending(requestConfig)

    requestConfig.topic = requestInfo.topic
    requestConfig.events =
      success: interpolate(@_patterns.receive, _.merge({status: @_statuses.success}, requestInfo))
      failure: interpolate(@_patterns.receive, _.merge({status: @_statuses.failure}, requestInfo))

    requestDelay = routeOptions.delay or @getOptions().request.delay

    _.delay =>
      {handlers} = @getOptions()
      {onSuccess, onFail} = routeOptions

      onSuccess ?= DEFAULT_SUCCESS
      onFail ?= DEFAULT_FAIL

      @_xhr.request(requestConfig)
        # if onFail doesn't Promise.reject anything, then the default fail will not fire.
        .then(_.partial(onSuccess, _, args...), _.partial(onFail, _, args...))
        .then(_.partial(handlers.onSuccess, _, args...), _.partial(handlers.onFail, _, args...))

    , requestDelay

# include and export cascading error handler for convenience/custom error handling.

module.exports = {APIHandler}
