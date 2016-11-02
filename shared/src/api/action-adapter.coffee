{Promise} = require 'es6-promise'
_ = require 'lodash'

updateRequestHandlers = (apiHandler, Actions, actions, requestInfo) ->
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
  apiHandler.routes.update(requestInfo)

connectTrigger = (apiHandler, Actions, actions, prepareRequest) ->
  {trigger} = actions

  Actions[trigger].addListener 'trigger', (args...) ->
    {requestInfo, routeData, requestData} = prepareRequest(args...)
    apiHandler.sendRequest(requestInfo, routeData, requestData, args...)

connectToAPIHandler = (apiHandler, Actions, actions, requestInfo, makeRouteData, makeRequestData) ->
  updateRequestHandlers(apiHandler, Actions, actions, requestInfo)
  connectTrigger(apiHandler, Actions, actions, (args...) ->
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

connectAsAction = (apiHandler, action, Actions, subject) ->
  handlerOptions = [apiHandler, Actions, actions[action], actionFrom(action, subject), makeIdRouteData]
  handlerOptions.push(makeDefaultRequestData) if action is 'update' or action is 'create'

  connectToAPIHandler(handlerOptions...)

adaptForHandler = (apiHandler) ->
  updateRequestHandlers: _.partial(updateRequestHandlers, apiHandler)
  connectTrigger: _.partial(connectTrigger, apiHandler)
  connectToAPIHandler: _.partial(connectToAPIHandler, apiHandler)
  connectAsAction: _.partial(connectAsAction, apiHandler)

module.exports = {
  adaptForHandler,

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
  deleteFrom
}
