axios = require 'axios'
{Promise} = require 'es6-promise'
_ = require 'underscore'
QS = require 'qs'
interpolate = require 'interpolate'

{AppActions, AppStore} = require '../flux/app'
{TimeActions} = require '../flux/time'
{CurrentUserActions, CurrentUserStore} = require '../flux/current-user'

# Do some special things when running without a tutor-server backend.
#
# - suffix calls with `.json` so we can have `/plans` and `/plans/1`
#   - otherwise there would be a file named `plans` and a directory named `plans`
# - do not error when a PUT occurs
IS_LOCAL = window.location.port is '8000' or window.__karma__

# Make sure API calls occur **after** all local Action listeners complete
delay = (ms, fn) -> setTimeout(fn, ms)

toParams = (object) ->
  QS.stringify(object, {arrayFormat: 'brackets'})

setNow = (headers) ->
  # X-App-Date with fallback to nginx date
  date = headers['X-App-Date'] or headers['Date']
  TimeActions.setFromString(date)

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


interceptors =
  queRequest: (requestConfig) ->
    AppActions.queRequest(requestConfig)
    requestConfig

  makeLocalRequest: (requestConfig) ->
    makeLocalRequest(requestConfig)
    requestConfig

  setResponseReceived: (response) ->
    {status, data, config, headers} = response

    AppActions.updateForResponse(status, data, config)
    setNow(headers) if headers
    response

  setErrorReceived: (errorResponse) ->
    {status, data, config, headers} = errorResponse

    AppActions.updateForResponse(status, data, config) if config
    setNow(headers) if headers
    Promise.reject(errorResponse)

  setResponseSuccess: (response) ->
    return response unless response?
    {status, statusText, config, headers} = response

    AppActions.setServerSuccess(status, statusText, config)
    response

  handleError: (errorResponse) ->
    {config} = errorResponse

    if _.isError(errorResponse)
      errorResponse =
        status: 1
        statusText: "#{errorResponse.name}: #{errorResponse.message}"

    Promise.reject(_.extend({handled: config?.handleError?}, errorResponse))

  handleMalformedRequest: (errorResponse) ->
    if errorResponse.status is 400
      CurrentUserActions.logout()
      errorResponse.handled = true

    Promise.reject(errorResponse)

  handleNotFound: (errorResponse) ->
    if errorResponse.status is 404
      errorResponse.statusText = 'ERROR_NOTFOUND'

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

setUpXHRInterceptors = ->
  # tell app that a request is pending.
  axios.interceptors.request.use(interceptors.queRequest)

  # modify request to use local stubs
  axios.interceptors.request.use(interceptors.makeLocalRequest) if IS_LOCAL

  # on response, transform error as needed
  axios.interceptors.response.use(null, interceptors.handleError)
  axios.interceptors.response.use(null, interceptors.handleMalformedRequest)
  axios.interceptors.response.use(null, interceptors.handleNotFound)
  axios.interceptors.response.use(null, interceptors.handleErrorMessage)

  # make sure app knows a response has been returned for a pending request,
  # for both successes and errors
  axios.interceptors.response.use(interceptors.setResponseReceived, interceptors.setErrorReceived)

  # set request status as a success and notify app
  # the error will be handle within the api handler catch as it may be customized
  # by the handler.
  axios.interceptors.response.use(interceptors.setResponseSuccess, null)

  # modify response when using the local api stubs.
  axios.interceptors.response.use(interceptors.makeLocalResponse, interceptors.handleLocalErrors) if IS_LOCAL

onRequestError = (response, requestConfig) ->
  AppActions.updateForResponse(response.status, response.data, requestConfig)
  AppActions.setServerError(response.status, response.data, requestConfig)

apiHelper = (Actions, listenAction, successAction, httpMethod, pathMaker, options) ->
  listenAction.addListener 'trigger', (args...) ->
    # Make sure API calls occur **after** all local Action listeners complete
    delay 20, ->
      {url, payload, httpMethod:httpMethodOverride} = pathMaker(args...)

      opts =
        method: httpMethod or httpMethodOverride
        dataType: 'json'
        headers:
          'X-CSRF-Token': CurrentUserStore.getCSRFToken(),
          token: CurrentUserStore.getToken()
        displayError: true

      if payload?
        opts.data = JSON.stringify(payload)
        opts.processData = false
        opts.contentType = 'application/json'

      requestConfig = _.extend({url}, opts, options)

      # Do not make another request with a config with the same url, methods, and data
      # if a previous one has not received a response.  Prevents duplicate requests.
      return if AppStore.isPending(requestConfig)

      resolved = ({data}) ->
        successAction(data, args...)

      rejected = (response) ->
        {status, statusText, statusMessage, data} = response
        requestConfig.handleError?(response, args...)
        # response.handled defaults to true if requestConfig.handleError
        # is present (in the Promise.reject with _.extend above)
        # The handleError function may explicitly set `response.handled = false`
        # to indicate that normal error handling should occur
        unless response.handled is true
          AppActions.setServerError(response.status, response.data, requestConfig)
          Actions.FAILED(status, statusMessage, args...)

      axios(requestConfig)
        .then(resolved, rejected)

setUpXHRInterceptors()

route = (method, interpolatedUrl, options) ->
  pathMaker = (actionArguments) ->
    url = interpolate(interpolatedUrl, actionArguments)
    payload = if _.isFunction(options.payload)
      options.payload.call(options, actionArguments)
    else
      options.payload
    {url, payload}

  if options.errorHandlers
    options.handleError = (request, args...) ->
      return unless _.isObject(request.data) and _.isArray(request.data.errors)
      handled_count = 0
      for error in request.data.errors
        handler = options.actions[ options.errorHandlers[error.code] ]
        if handler
          handler(args..., error, request)
          handled_count += 1
      request.handled = (handled_count is request.data.errors.length)

  apiHelper(
    options.actions, options.actions[options.trigger], options.actions[options.onSuccess],
    method, pathMaker, options
  )


module.exports = {apiHelper, IS_LOCAL, toParams, onRequestError, route}
