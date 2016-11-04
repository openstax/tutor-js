{Promise} = require 'es6-promise'
_ = require 'lodash'
interpolate = require 'interpolate'
{METHODS_TO_ACTIONS} = require './collections'

makeRequestHandlers = (Actions, options) ->
  {onSuccess, onFail} = options
  onFail ?= 'FAILED'

  handlers =
    onSuccess: (response, args...) ->
      Actions[onSuccess](response.data, args...)
      response

  if options.handleError?
    handlers.onFail = (error, args...) ->
      {response} = error
      isErrorHandled = options.handleError(response, args...)

      Promise.reject(error) unless isErrorHandled

  if options.errorHandlers?
    handlers.onFail = (error, args...) ->
      {response} = error
      {errors} = response.data

      unhandledErrors = _.reject(errors, (error) ->
        if options.errorHandlers[error.code]?
          Actions[options.errorHandlers[error.code]]?(args..., error)
      )

      unless _.isEmpty(unhandledErrors)
        error.response.data.errors = unhandledErrors
        Promise.reject(error)

  handlers.onFail ?= (error, args...) ->
    {response} = error
    {status, statusMessage} = response

    Actions[onFail](status, statusMessage, args...)
    Promise.reject(error)

  handlers

updateRequestHandlers = (apiHandler, Actions, actions, requestInfo) ->
  handlers = makeRequestHandlers(Actions, _.merge({}, actions, requestInfo))
  requestInfo = _.merge(handlers, _.omit(requestInfo, 'handleError', 'errorHandlers'))

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

ACTIONS =
  create: createActions
  read: readActions
  update: updateActions
  'delete': deleteActions

METHODS = _.invert(METHODS_TO_ACTIONS)

actionFrom = (action, subject) ->
  {subject, action}

createFrom = _.partial(actionFrom, 'create')
readFrom = _.partial(actionFrom, 'read')
updateFrom = _.partial(actionFrom, 'update')
deleteFrom = _.partial(actionFrom, 'delete')

connectAsAction = (apiHandler, action, Actions, subject) ->
  handlerOptions = [apiHandler, Actions, ACTIONS[action], actionFrom(action, subject), makeIdRouteData]
  handlerOptions.push(makeDefaultRequestData) if action is 'update' or action is 'create'

  connectToAPIHandler(handlerOptions...)

connectHandler = (apiHandler, Actions, options) ->
  {trigger} = options

  Actions[trigger].addListener 'trigger', (args...) ->
    options = _.mapValues(options, (option) ->
      if _.isFunction(option) then option(args...) else option
    )

    handlers = makeRequestHandlers(Actions, options)

    requestConfig = _.pick(options, 'url', 'method', 'data', 'params')
    requestConfig.url ?= interpolate(options.pattern, options.route or makeIdRouteData(args...))

    requestOptions = _.merge(_.pick(options, 'delay'), handlers)

    apiHandler.send(requestConfig, requestOptions, args...)

connectAction = (action, apiHandler, Actions, options, make) ->
  options = _.merge({method: METHODS[action]}, ACTIONS[action], options)
  connectHandler(apiHandler, Actions, options, make)

connectCreate = _.partial(connectAction, 'create')
connectRead = _.partial(connectAction, 'read')
connectUpdate = _.partial(connectAction, 'update')
connectDelete = _.partial(connectAction, 'delete')

adaptForHandler = (apiHandler) ->
  updateRequestHandlers: _.partial(updateRequestHandlers, apiHandler)
  connectTrigger: _.partial(connectTrigger, apiHandler)
  connectToAPIHandler: _.partial(connectToAPIHandler, apiHandler)
  connectAsAction: _.partial(connectAsAction, apiHandler)

adaptHandler = (apiHandler) ->
  connectAction:  _.partial(connectAction, apiHandler)
  connectHandler: _.partial(connectHandler, apiHandler)
  connectCreate:  _.partial(connectCreate, apiHandler)
  connectRead:    _.partial(connectRead, apiHandler)
  connectUpdate:  _.partial(connectUpdate, apiHandler)
  connectDelete:  _.partial(connectDelete, apiHandler)

module.exports = {
  adaptForHandler,
  adaptHandler,

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
