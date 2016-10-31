{APIHandler} = require 'shared'
routes = require './routes'

{TimeActions} = require '../flux/time'

setNow = (headers) ->
  # X-App-Date with fallback to nginx date
  date = headers['X-App-Date'] or headers['Date']
  TimeActions.setFromString(date)

createAPIHandler = ->
  options =
    xhr:
      baseURL: "#{window.location}/api"
    handlers:
      onFail: (error, args...) ->
        {response} = error
        {status, statusText, statusMessage, data} = response

        # AppActions.setServerError(response.status, response.data, requestConfig)
        # Actions.FAILED(status, statusMessage, args...)

  new APIHandler(options, routes)

setUpAPIHandler = ->
  tutorAPIHandler = createAPIHandler()

  tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
    headers = response.headers or response.response.headers
    setNow(headers)
  )

apiHelper = (Actions, listenAction, successAction, httpMethod, pathMaker, options) ->
  listenAction.addListener 'trigger', (args...) ->
