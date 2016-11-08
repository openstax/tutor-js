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

resolveOption = (option, key, args...) ->
  if _.isFunction(option) and key isnt 'handleError'
    option(args...)
  else
    option

resolveAndMergeHandlerOptions = (options, makeRequestOptions, args...) ->
  resolvedAndMergedOptions = _.mapValues(options, _.partial(resolveOption, _, _, args...))
  additionalRequestOptions = _.map(makeRequestOptions, _.partial(resolveOption, _, _, args...))
  _.merge(resolvedAndMergedOptions, additionalRequestOptions...)
  resolvedAndMergedOptions

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

connectHandler = (apiHandler, Actions, allOptions...) ->
  [objectOptions, makeRequestOptions] = _.partition(allOptions, _.isObject)
  options = _.merge({}, objectOptions...)
  {trigger} = options

  Actions[trigger].addListener 'trigger', (args...) ->
    request = resolveAndMergeHandlerOptions(options, makeRequestOptions, args...)

    handlers = makeRequestHandlers(Actions, options)

    requestConfig = _.pick(request, 'url', 'method', 'data', 'params')
    requestConfig.url ?= interpolate(options.pattern, options.route or makeIdRouteData(args...))

    requestOptions = _.merge(_.pick(request, 'delay'), handlers)

    apiHandler.send(requestConfig, requestOptions, args...)

connectAction = (action, apiHandler, Actions, allOptions...) ->
  actionOptions = _.merge(method: METHODS[action], ACTIONS[action] or {})
  connectHandler(apiHandler, Actions, actionOptions, allOptions...)

adaptHandler = (apiHandler) ->
  connectHandler: _.partial(connectHandler, apiHandler)
  connectCreate:  _.partial(connectAction, 'create', apiHandler)
  connectRead:    _.partial(connectAction, 'read', apiHandler)
  connectUpdate:  _.partial(connectAction, 'update', apiHandler)
  connectDelete:  _.partial(connectAction, 'delete', apiHandler)
  connectModify:  _.partial(connectAction, 'modify', apiHandler)

module.exports = adaptHandler
