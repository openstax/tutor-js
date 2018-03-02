{Promise} = require 'es6-promise'
interpolate = require 'interpolate'
{METHODS_TO_ACTIONS} = require './collections'
qs = require 'qs'
partial   = require 'lodash/partial'
map       = require 'lodash/map'
mapValues = require 'lodash/mapValues'
reject    = require 'lodash/reject'
pick      = require 'lodash/pick'
merge     = require 'lodash/merge'
wrap      = require 'lodash/wrap'
invert    = require 'lodash/invert'
partition = require 'lodash/partition'
defaults  = require 'lodash/defaults'
isEmpty   = require 'lodash/isEmpty'
first     = require 'lodash/first'
bind      = require 'lodash/bind'
clone     = require 'lodash/clone'
isFunction = require 'lodash/isFunction'
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

emptyFn = (config) -> {}

connectModelAction = (action, apiHandler, klass, method, options) ->
  actionOptions = defaults(options, { method: METHODS[action] })
  handler = (originalMethod, reqArgs...) ->
    firstArg = first(reqArgs)
    requestConfig = mapValues(
      pick(options, 'url', 'query', 'method', 'data', 'params', 'handledErrors'), (val) =>
        if isFunction(val) then val.call(this, reqArgs...) else val
    )
    updatedConfig = originalMethod.call(this, reqArgs..., requestConfig)
    return if updatedConfig is "ABORT"
    merge(requestConfig, updatedConfig)
    if options.pattern
      requestConfig.url ?= interpolate(options.pattern, defaults({}, firstArg, requestConfig, this))
    { query } = requestConfig
    if query
      query = qs.stringify(query, { arrayFormat: 'brackets', encode: false }) if isObjectLike(requestConfig.query)
      requestConfig.url += "?#{query}"

    perRequestOptions = clone(options)
    if options.onSuccess
      perRequestOptions.onSuccess = bind(
        this[options.onSuccess], this, bind.placeholder, reqArgs, requestConfig
      )
    perRequestOptions.onFail = if options.onFail
      bind(this[options.onFail] , this, bind.placeholder, reqArgs, requestConfig)
    else
      apiHandler.getOptions().handlers.onFail

    this.api?.requestsInProgress.set(action, requestConfig)
    apiHandler.send(requestConfig, perRequestOptions, firstArg).then((reply) =>
      this.api?.requestCounts[action] += 1
      this.api?.requestsInProgress.delete(action)
      reply
    ).catch((e) =>
      this.api?.requestsInProgress.delete(action)
      console.warn(e)
      perRequestOptions.onFail(e)
      Promise.reject(e)
    )

  klass.prototype[method] = wrap(klass.prototype[method] or emptyFn, handler)


adaptHandler = (apiHandler) ->
  connectHandler: partial(connectHandler, apiHandler)
  connectCreate:  partial(connectAction, 'create', apiHandler)
  connectRead:    partial(connectAction, 'read',   apiHandler)
  connectUpdate:  partial(connectAction, 'update', apiHandler)
  connectDelete:  partial(connectAction, 'delete', apiHandler)
  connectModify:  partial(connectAction, 'modify', apiHandler)

  connectModelCreate: partial(connectModelAction, 'create', apiHandler)
  connectModelRead:   partial(connectModelAction, 'read',   apiHandler)
  connectModelUpdate: partial(connectModelAction, 'update', apiHandler)
  connectModelDelete: partial(connectModelAction, 'delete', apiHandler)

module.exports = adaptHandler
