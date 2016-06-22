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
    requestConfig.method = 'GET'

  requestConfig.url = _.compact(url_parts).join('?')

makeLocalResponse = (response) ->
  payload = if response.config.data then JSON.parse(response.config.data) else {}
  response.data = _.extend({}, response.data, payload)

setUpXHRInterceptors = ->
  axios.interceptors.request.use (requestConfig) ->
    AppActions.queRequest(requestConfig)

    makeLocalRequest(requestConfig) if IS_LOCAL

    requestConfig

  axios.interceptors.response.use (response) ->
    {status, statusText, config} = response
    AppActions.setServerSuccess(status, statusText, config)

    makeLocalResponse(response) if IS_LOCAL

    response

  , (errorResponse) ->

    if _.isError(errorResponse)
      errorResponse =
        status: 1
        statusText: "#{errorResponse.name}: #{errorResponse.message}"
    else
      {status, statusText, config} = errorResponse
      AppActions.setServerError(status, statusText, config)

    Promise.reject(errorResponse)

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

      opts = _.extend({}, opts, options)

      resolved = ({headers, data}) ->
        setNow(headers)
        successAction(data, args...) # Include listenAction for faking

      rejected = (response) ->
        # jqXhr, statusMessage, err
        statusCode = response.status
        statusMessage = response.statusText

        if response.headers
          setNow(response.headers)
        else
          AppActions.setServerError(statusCode, statusMessage, _.extend({url}, opts))

        if statusCode is 400
          CurrentUserActions.logout()
        # TODO eventually pull this out to the interceptors as well or remove if no longer needed
        else if statusMessage is 'parsererror' and statusCode is 200 and IS_LOCAL
          if httpMethod is 'PUT' or httpMethod is 'PATCH'
            # HACK for PUT
            successAction(null, args...)
          else
            # Hack for local testing. Webserver returns 200 + HTML for 404's
            Actions.FAILED(404, 'Error Parsing the JSON or a 404', args...)
        else if statusCode is 404
          Actions.FAILED(statusCode, 'ERROR_NOTFOUND', args...)
        else
          # Parse the error message and fail
          try
            msg = JSON.parse(statusMessage)
          catch e
            msg = statusMessage

          Actions.FAILED(statusCode, msg, args...)

      axios(url, opts)
        .then(resolved, rejected)

setUpXHRInterceptors()

module.exports = {apiHelper, IS_LOCAL}
