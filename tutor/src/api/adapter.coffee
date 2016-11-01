{APIHandler} = require 'shared'
{Promise} = require 'es6-promise'
_ = require 'lodash'

routes = require './routes'

{TimeActions} = require '../flux/time'
{AppActions} = require '../flux/app'

tutorAPIHandler = null

setNow = (headers) ->
  # X-App-Date with fallback to nginx date
  date = headers['X-App-Date'] or headers['Date']
  TimeActions.setFromString(date)

createAPIHandler = ->
  options =
    xhr:
      baseURL: "#{window.location.origin}/api"
    handlers:
      onFail: (error, args...) ->
        {response, config} = error
        AppActions.setServerError(response, config)

  new APIHandler(options, routes)

setUpAPIHandler = ->
  tutorAPIHandler = createAPIHandler()

  tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
    headers = response.headers or response.response.headers
    setNow(headers)
  )

  tutorAPIHandler

connectToAPIHandler = (Actions, actions, requestInfo, makeRouteData, makeRequestData) ->
  {trigger, onSuccess, onFail} = actions
  onFail ?= 'FAILED'

  handlers =
    onSuccess: (response, args...) ->
      Actions[onSuccess](response.data, args...)
      response

  if requestInfo.handleError?
    handlers.onFail = (error, args...) ->
      {response} = error
      isErrorHandled = requestInfo.handleError(response, args...)

      Promise.reject(error) unless isErrorHandled

    _.unset(requestInfo, 'handleError')

  if requestInfo.errorHandlers?
    handlers.onFail = (error, args...) ->
      {response} = error
      {errors} = response.data

      unhandledErrors = _.reject(errors, (error) ->
        if requestInfo.errorHandlers[error.code]?
          Actions[requestInfo.errorHandlers[error.code]]?(args..., error)
      )

      unless _.isEmpty(unhandledErrors)
        error.response.data.errors = unhandledErrors
        Promise.reject(error)

    _.unset(requestInfo, 'errorHandlers')

  handlers.onFail ?= (error, args...) ->
    {response} = error
    {status, statusMessage} = response

    Actions[onFail](status, statusMessage, args...)
    Promise.reject(error)

  requestInfo = _.merge(handlers, requestInfo)
  tutorAPIHandler.routes.update(requestInfo)

  Actions[trigger].addListener 'trigger', (args...) ->
    topic = _.first(args)

    requestInfo = _.merge({topic}, requestInfo)
    routeData = makeRouteData?(args...) or {}
    requestData = makeRequestData?(args...) or {}
    tutorAPIHandler.sendRequest(requestInfo, routeData, requestData, args...)

module.exports = {setUpAPIHandler, connectToAPIHandler}
