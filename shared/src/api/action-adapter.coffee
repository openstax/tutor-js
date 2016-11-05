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

# convenient aliases
makeIdRouteData = (id) -> {id} if id?

ACTIONS =
  create:
    trigger: 'create'
    onSuccess: 'created'
  read:
    trigger: 'load'
    onSuccess: 'loaded'
  update:
    trigger: 'save'
    onSuccess: 'saved'
  'delete':
    trigger: 'delete'
    onSuccess: 'deleted'

METHODS = _.invert(METHODS_TO_ACTIONS)

connectHandler = (apiHandler, Actions, options, makeOptions) ->
  {trigger} = options

  Actions[trigger].addListener 'trigger', (args...) ->
    request = _.mapValues(options, (option) ->
      if _.isFunction(option) then option(args...) else option
    )
    _.merge(request, makeOptions(args...)) if _.isFunction(makeOptions)

    handlers = makeRequestHandlers(Actions, options)

    requestConfig = _.pick(request, 'url', 'method', 'data', 'params')
    requestConfig.url ?= interpolate(options.pattern, options.route or makeIdRouteData(args...))

    requestOptions = _.merge(_.pick(request, 'delay'), handlers)

    apiHandler.send(requestConfig, requestOptions, args...)

connectAction = (action, apiHandler, Actions, options = {}, makeOptions) ->
  if _.isFunction(options)
    makeOptions = options
    options = {}

  options = _.merge(method: METHODS[action], ACTIONS[action] or {}, options)

  connectHandler(apiHandler, Actions, options, makeOptions)

adaptHandler = (apiHandler) ->
  connectHandler: _.partial(connectHandler, apiHandler)
  connectCreate:  _.partial(connectAction, 'create', apiHandler)
  connectRead:    _.partial(connectAction, 'read', apiHandler)
  connectUpdate:  _.partial(connectAction, 'update', apiHandler)
  connectDelete:  _.partial(connectAction, 'delete', apiHandler)
  connectModify:  _.partial(connectAction, 'modify', apiHandler)

module.exports = adaptHandler
