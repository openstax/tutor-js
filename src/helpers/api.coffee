axios = require 'axios'
{Promise} = require 'es6-promise'
_ = require 'underscore'
QS = require 'qs'

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

  setResponse: (response) ->
    {status, statusText, config, headers} = response

    AppActions.setServerSuccess(status, statusText, config)
    setNow(headers)

    response

  handleError: (errorResponse) ->
    if _.isError(errorResponse)
      errorResponse =
        status: 1
        statusText: "#{errorResponse.name}: #{errorResponse.message}"
    else if errorResponse.headers
      setNow(errorResponse.headers)

    Promise.reject(_.extend({handled: false}, errorResponse))

  makeLocalResponse: (response) ->
    makeLocalResponse(response)
    response

  handleMalformedRequest: (errorResponse) ->
    if errorResponse.status is 400
      CurrentUserActions.logout()
      errorResponse.handled = true

    Promise.reject(errorResponse)

  handleNotFound: (errorResponse) ->
    if errorResponse.status is 404
      errorResponse.statusText = 'ERROR_NOTFOUND'

    Promise.reject(errorResponse)

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

  handleErrorMessage: (errorResponse) ->
    {statusText} = errorResponse

    try
      msg = JSON.parse(statusText)
    catch e
      msg = statusText

    errorResponse.statusMessage = msg
    Promise.reject(errorResponse)

setUpXHRInterceptors = ->
  axios.interceptors.request.use(interceptors.queRequest)
  axios.interceptors.request.use(interceptors.makeLocalRequest) if IS_LOCAL

  axios.interceptors.response.use(interceptors.setResponse, interceptors.handleError)
  axios.interceptors.response.use(null, interceptors.handleMalformedRequest)
  axios.interceptors.response.use(null, interceptors.handleNotFound)
  axios.interceptors.response.use(interceptors.makeLocalResponse, interceptors.handleLocalErrors) if IS_LOCAL
  axios.interceptors.response.use(null, interceptors.handleErrorMessage)

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
        # For now, the backend is expecting JSON and cannot accept url-encoded forms
        opts.contentType = 'application/json'

      requestConfig = _.extend({url}, opts, options)
      return if AppStore.isPending(requestConfig)

      resolved = ({data}) ->
        successAction(data, args...)

      rejected = (response) ->
        {status, statusText, statusMessage, handled} = response

        AppActions.setServerError(status, statusText, requestConfig)
        return if handled

        Actions.FAILED(status, statusMessage, args...)

      axios(requestConfig)
        .then(resolved, rejected)

setUpXHRInterceptors()

module.exports = {apiHelper, IS_LOCAL, toParams}
