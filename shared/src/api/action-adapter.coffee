{Promise} = require 'es6-promise'
interpolate = require 'interpolate'
{METHODS_TO_ACTIONS} = require './collections'

partial   = require 'lodash/partial'
map       = require 'lodash/map'
mapValues = require 'lodash/mapValues'
reject    = require 'lodash/reject'
pick      = require 'lodash/pick'
merge     = require 'lodash/merge'
invert    = require 'lodash/invert'
partition = require 'lodash/partition'
isEmpty   = require 'lodash/isEmpty'
isObjectLike  = require 'lodash/isObjectLike'
isFunction    = require 'lodash/isFunction'

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

      unhandledErrors = reject(errors, (error) ->
        if options.errorHandlers[error.code]?
          Actions[options.errorHandlers[error.code]]?(args..., error)
      )

      unless isEmpty(unhandledErrors)
        error.response.data.errors = unhandledErrors
        Promise.reject(error)

  handlers.onFail ?= (error, args...) ->
    {response} = error
    {status, statusMessage} = response

    Actions[onFail](status, statusMessage, args...)
    Promise.reject(error)

  handlers

resolveOptions = (args...) ->
  (option, key) ->
    if isFunction(option) and key isnt 'handleError'
      option(args...)
    else
      option

resolveAndMergeHandlerOptions = (options, makeRequestOptions, args...) ->
  resolvedAndMergedOptions = mapValues(options, resolveOptions(args...))
  additionalRequestOptions = map(makeRequestOptions, resolveOptions(args...))
  merge(resolvedAndMergedOptions, additionalRequestOptions...)
  resolvedAndMergedOptions

# convenient aliases
makeIdRouteData = (data) ->
  if isObjectLike(data)
    data
  else
    {id: data}

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

METHODS = invert(METHODS_TO_ACTIONS)

connectHandler = (apiHandler, Actions, allOptions...) ->
  [objectOptions, makeRequestOptions] = partition(allOptions, isObjectLike)
  options = merge({}, objectOptions...)
  {trigger} = options

  Actions[trigger].addListener 'trigger', (args...) ->
    request = resolveAndMergeHandlerOptions(options, makeRequestOptions, args...)

    handlers = makeRequestHandlers(Actions, options)

    requestConfig = pick(request, 'url', 'method', 'data', 'params', 'handledErrors')
    requestConfig.url ?= interpolate(options.pattern, options.route or makeIdRouteData(args...))

    requestOptions = merge(pick(request, 'delay'), handlers)

    apiHandler.send(requestConfig, requestOptions, args...)

connectAction = (action, apiHandler, Actions, allOptions...) ->
  actionOptions = merge(method: METHODS[action], ACTIONS[action] or {})
  connectHandler(apiHandler, Actions, actionOptions, allOptions...)

adaptHandler = (apiHandler) ->
  connectHandler: partial(connectHandler, apiHandler)
  connectCreate:  partial(connectAction, 'create', apiHandler)
  connectRead:    partial(connectAction, 'read', apiHandler)
  connectUpdate:  partial(connectAction, 'update', apiHandler)
  connectDelete:  partial(connectAction, 'delete', apiHandler)
  connectModify:  partial(connectAction, 'modify', apiHandler)

module.exports = adaptHandler
