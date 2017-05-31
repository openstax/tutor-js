{Promise} = require 'es6-promise'
axios = require 'axios'

interpolate = require 'interpolate'

partial   = require 'lodash/partial'
isEmpty   = require 'lodash/isEmpty'
pick      = require 'lodash/pick'
omit      = require 'lodash/omit'
merge     = require 'lodash/merge'
delay     = require 'lodash/delay'
assign    = require 'lodash/assign'
spread    = require 'lodash/spread'
forEach   = require 'lodash/forEach'
isEmpty   = require 'lodash/isEmpty'
defaultsDeep  = require 'lodash/defaultsDeep'

# this is pretty terrible.
require 'extract-values'

EventEmitter2 = require 'eventemitter2'
Networking = require '../model/networking'
{Routes, XHRRecords, utils, METHODS_TO_ACTIONS} = require './collections'
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
  errorNameProperty: 'code'

setUpXHRInterceptors = (xhrInstance, interceptors, isLocal) ->
  # tell app that a request is pending.
  xhrInstance.interceptors.request.use(interceptors.queRequest)

  # modify request to use local stubs
  xhrInstance.interceptors.request.use(interceptors.makeLocalRequest) if isLocal

  # modify response when using the local api stubs.
  xhrInstance.interceptors.response.use(interceptors.makeLocalResponse, interceptors.handleLocalErrors) if isLocal

  # make sure app knows a response has been returned for a pending request,
  # for both successes and errors
  xhrInstance.interceptors.response.use(interceptors.setResponseReceived, interceptors.setErrorReceived)

  # broadcast response status
  xhrInstance.interceptors.response.use(interceptors.broadcastSuccess, interceptors.broadcastError)

  # on response, transform error as needed
  xhrInstance.interceptors.response.use(null, interceptors.handleNonAPIErrors)
  xhrInstance.interceptors.response.use(null, interceptors.handleMalformedRequest)
  xhrInstance.interceptors.response.use(null, interceptors.handleNotFound)
  xhrInstance.interceptors.response.use(null, interceptors.handleErrorMessage)

  xhrInstance.interceptors.response.use(null, interceptors.filterErrors)

makeRequestConfig = (routeOptions, routeData, requestData) ->
  {pattern} = routeOptions

  requestConfig = omit(routeOptions, 'subject', 'topic', 'pattern', 'action', 'delay', 'onSuccess', 'onFail')
  requestConfig.url = interpolate(pattern, routeData)

  unless isEmpty(requestData)
    if requestData.data or requestData.params
      merge(requestConfig, pick(requestData, 'data', 'params'))
    else
      requestConfig.data = requestData

  requestConfig

guessInfoFromConfig = (requestConfig) ->
  uriParts = requestConfig.url.split('/')

  subject = requestConfig.url
  topic = uriParts[1] or 'topic'
  action = METHODS_TO_ACTIONS[requestConfig.method]

  {subject, topic, action}

DEFAULT_SUCCESS = (response) -> response
DEFAULT_FAIL = (response) -> Promise.reject(response)

ALL_EVENTS =
  subject: '*'
  topic: '*'
  action: '*'




class APIHandlerBase
  constructor: (options, channel) ->
    @setOptions(options)

    @initializeRecords()
    @initializeEventOptions(@getOptions().eventOptions)
    @initializeXHR(@getOptions().xhr, new Interceptors(@getOptions().hooks, @), @getOptions().isLocal)

  destroy: =>
    @channel.removeAllListeners()

  initializeRecords: =>
    @records = new XHRRecords()

  initializeXHR: (xhrOptions, interceptors, isLocal) =>
    xhr = axios.create(xhrOptions)
    setUpXHRInterceptors(xhr, interceptors, isLocal)

    @_xhr = xhr

  updateXHR: (xhrOptions) =>
    Networking.updateOptions(xhr: xhrOptions)
    defaultsDeep(@_xhr.defaults, xhrOptions)

  initializeEventOptions: (eventOptions) =>
    {pattern, send, receive, statuses} = eventOptions

    # {subject}.{topic}.{action}.send||(receive.(failure||success))
    patterns =
      base: pattern
      send: [pattern, send].join('.')
      receive: [pattern, receive].join('.')

    @_patterns = patterns
    @_statuses = statuses

  setOptions: (options) =>
    previousOptions = @getOptions?() or {}
    options = merge({}, API_DEFAULTS, previousOptions, options)
    Networking.setOptions(options)

    @getOptions = -> options

  # send can now be used separately without initializing routes
  send: (requestConfig, routeOptions, args...) ->
    return if @records.isPending(requestConfig)

    requestInfo = pick(routeOptions, 'subject', 'topic', 'action')
    requestInfo = guessInfoFromConfig(requestConfig) if isEmpty(requestInfo)

    requestConfig.events =
      success: interpolate(@_patterns.receive, merge({status: @_statuses.success}, requestInfo))
      failure: interpolate(@_patterns.receive, merge({status: @_statuses.failure}, requestInfo))

    requestDelay = routeOptions.delay or @getOptions().request.delay
    {handlers} = @getOptions()
    {onSuccess, onFail} = routeOptions

    onSuccess ?= DEFAULT_SUCCESS
    onFail ?= DEFAULT_FAIL

    onSuccessHandler = (fn, args) ->
      (resp) ->
        fn(resp, args...)
        Promise.resolve(resp)
    onFailHandler = (fn, args) ->
      (resp) ->
        fn(resp, args...)
        Promise.reject(resp)

    return new Promise (resolve, reject) =>

      delay =>
        @_xhr.request(requestConfig)
          .then(onSuccessHandler(onSuccess, args), onFailHandler(onFail, args))
          .then(onSuccessHandler(handlers.onSuccess, args), onFailHandler(handlers.onFail, args))
          .then(resolve, reject)

      , requestDelay


class APIHandler extends APIHandlerBase
  constructor: (options, routes = [], channel) ->
    super(options, channel)

    @initializeRoutes(routes) unless isEmpty(routes)
    @setUpReceivers(@getOptions().events)
    @initializeEvents(@getOptions().events, routes.length, channel)

  initializeRoutes: (routes) =>
    @routes = new Routes(routes)

  setUpReceivers: (events) =>
    sendRequest = @sendRequest
    patterns = @_patterns

    handleSend = (args...) ->
      requestInfo = extractValues(@event, patterns.send)
      sendRequest(requestInfo, args...)

    events.push([interpolate(patterns.send, ALL_EVENTS), handleSend])

  initializeEvents: (events, numberOfRoutes, channel) =>
    @channel = channel or new EventEmitter2 wildcard: true, maxListeners: numberOfRoutes * 2
    forEach(events, spread(@channel.on.bind(@channel)))

  sendRequest: (requestInfo, routeData, requestData, args...) =>
    routeOptions = @routes.get(requestInfo)
    # TODO throw error somewheres.
    return unless routeOptions?

    requestConfig = makeRequestConfig(routeOptions, routeData, requestData)
    requestConfig.topic = requestInfo.topic

    merge(routeOptions, pick(requestInfo, 'subject', 'topic', 'action'))

    @send(requestConfig, routeOptions, args...)

# include and export cascading error handler for convenience/custom error handling.

module.exports = {APIHandler, APIHandlerBase}
