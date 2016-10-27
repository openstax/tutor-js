_ = require 'lodash'
{Promise} = require 'es6-promise'

makeLocalRequest = (requestConfig) ->
  {url} = requestConfig

  [uri, params] = url.split('?')
  if requestConfig.method is 'GET'
    url_parts = ["#{uri}.json", params]
  else
    url_parts = ["#{uri}/#{requestConfig.method}.json", params]
    requestConfig.mockMethod = requestConfig.method
    requestConfig.method = 'GET'

  requestConfig.url = _.compact(url_parts).join('?')

makeLocalResponse = (response) ->
  payload = if response.config.data then JSON.parse(response.config.data) else {}
  response.data = _.extend({}, response.data, payload)

class Interceptors
  constructor: (hooks = {}, apiHandler) ->
    @_apiHandler = apiHandler
    @hookIntercepts(hooks)

  hookIntercepts: (hooks) ->
    _.forEach hooks, (hook, hookName) =>
      originalIntercept = @[hookName]

      @[hookName] = (args...) =>
        hook(args...)
        originalIntercept(args...)

  queRequest: (requestConfig) ->
    @_apiHandler._records.queRequest(requestConfig)
    requestConfig

  makeLocalRequest: (requestConfig) ->
    makeLocalRequest(requestConfig)
    requestConfig

  setResponseReceived: (response) ->
    @_apiHandler._records.recordResponse(response)
    response

  setErrorReceived: (response) ->
    @_apiHandler._records.recordResponse(response)
    Promise.reject(response)

  broadcastSuccess: (response) ->
    {config} = response
    @_apiHandler._channel.emit(config.events.success, response)
    response

  broadcastError: (response) ->
    {config} = response
    @_apiHandler._channel.emit(config.events.failure, response)
    Promise.reject(response)

  makeLocalResponse: (response) ->
    makeLocalResponse(response)
    response

  handleLocalErrors: (errorResponse) ->
    {status, statusText, config} = errorResponse
    {method, mockMethod} = config

    mockMethods = ['PUT', 'PATCH']

    # Hack for local testing, fake successful PUT and PATCH
    if _.contains(mockMethods, mockMethod or method) and status is 404
      errorResponse.statusText = """No mock data found at #{config.url}.
      This error only happens locally."""

    # Hack for local testing. Webserver returns 200 + HTML for 404's
    if statusText is 'parsererror' and status is 200
      errorResponse.status = 404
      errorResponse.statusText = 'Error Parsing the JSON or a 404'

    Promise.reject(errorResponse)

  handleError: (errorResponse) ->
    if _.isError(errorResponse)
      errorResponse =
        status: 1
        statusText: "#{errorResponse.name}: #{errorResponse.message}"

    Promise.reject(errorResponse)

  handleMalformedRequest: (errorResponse) ->
    # if errorResponse.status is 400
      # CurrentUserActions.logout()

    Promise.reject(null)

  handleNotFound: (errorResponse) ->
    if errorResponse.status is 404
      errorResponse.statusText ?= 'ERROR_NOTFOUND'

    Promise.reject(errorResponse)

  handleErrorMessage: (errorResponse) ->
    {statusText, data} = errorResponse

    try
      msg = JSON.parse(statusText)
    catch e
      msg = statusText

    errorResponse.statusMessage = msg

    unless _.isObject(data)
      try
        errorResponse.data = JSON.parse(data)
      catch e

    Promise.reject(errorResponse)

module.exports = {Interceptors}
