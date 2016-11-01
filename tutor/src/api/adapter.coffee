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
        {response} = error
        AppActions.setServerError(response)
    hooks:
      handleMalformedRequest: ->
        CurrentUserActions.logout()
        null

  new APIHandler(options, routes)

setUpAPIHandler = ->
  tutorAPIHandler = createAPIHandler()

  tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
    headers = response.headers or response.response.headers
    setNow(headers)
  )

  tutorAPIHandler

updateRequestHandlers = (Actions, actions, requestInfo) ->
  {onSuccess, onFail} = actions
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

connectTrigger = (Actions, actions, prepareRequest) ->
  {trigger} = actions

  Actions[trigger].addListener 'trigger', (args...) ->
    {requestInfo, routeData, requestData} = prepareRequest(args...)
    tutorAPIHandler.sendRequest(requestInfo, routeData, requestData, args...)

connectToAPIHandler = (Actions, actions, requestInfo, makeRouteData, makeRequestData) ->
  updateRequestHandlers(Actions, actions, requestInfo)
  connectTrigger(Actions, actions, (args...) ->
    topic = _.first(args) or 'topic'

    requestInfo = _.merge({topic}, requestInfo)
    routeData = makeRouteData?(args...) or {}
    requestData = makeRequestData?(args...) or {}

    {requestInfo, routeData, requestData}
  )

# convenient aliases
makeIdRouteData = (id) -> {id} if id?
makeDefaultRequestData = (id, data) -> {data} if data?

createActions =
  trigger: 'create'
  onSuccess: 'created'

readActions =
  trigger: 'load'
  onSuccess: 'loaded'

updateActions =
  trigger: 'save'
  onSuccess: 'saved'

deleteActions =
  trigger: 'delete'
  onSuccess: 'deleted'

actions =
  create: createActions
  read: readActions
  update: updateActions
  'delete': deleteActions

actionFrom = (action, subject) ->
  {subject, action}

createFrom = _.partial(actionFrom, 'create')
readFrom = _.partial(actionFrom, 'read')
updateFrom = _.partial(actionFrom, 'update')
deleteFrom = _.partial(actionFrom, 'delete')

connectAsAction = (action, Actions, subject) ->
  handlerOptions = [Actions, actions[action], actionFrom(action, subject), makeIdRouteData]
  handlerOptions.push(makeDefaultRequestData) if action is 'update' or action is 'create'

  connectToAPIHandler(handlerOptions...)

module.exports = {
  setUpAPIHandler,
  updateRequestHandlers,
  connectTrigger,
  connectToAPIHandler,

  makeIdRouteData,
  makeDefaultRequestData,

  createActions,
  readActions,
  updateActions,
  deleteActions,

  actionFrom,
  createFrom,
  readFrom,
  updateFrom,
  deleteFrom,

  connectAsAction
}
