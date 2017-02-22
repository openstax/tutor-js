hash = require 'object-hash'
moment = require 'moment'

partial   = require 'lodash/partial'
every     = require 'lodash/every'
pick      = require 'lodash/pick'
trim      = require 'lodash/trim'
omit      = require 'lodash/omit'
omitBy    = require 'lodash/omitBy'
merge     = require 'lodash/merge'
some      = require 'lodash/some'
has       = require 'lodash/has'
flow      = require 'lodash/flow'
last      = require 'lodash/last'
size      = require 'lodash/size'
keys      = require 'lodash/keys'
memoize   = require 'lodash/memoize'
forEach   = require 'lodash/forEach'
isEmpty   = require 'lodash/isEmpty'
cloneDeep = require 'lodash/cloneDeep'
isString  = require 'lodash/isString'
isUndefined  = require 'lodash/isUndefined'

validateOptions = (requiredProperties...) ->
  (options) ->
    every(requiredProperties, partial(has, options))

hashWithArrays = partial(hash, partial.placeholder, {unorderedArrays: true})

makeHashWith = (uniqueProperties...) ->
  (objectToHash) ->
    hashWithArrays(pick(objectToHash, uniqueProperties...))

constructCollection = (context, makeItem, lookup) ->
  context._cache = {}
  context.make = makeItem
  context.lookup = memoize(lookup) or memoize(flow(makeItem, hashWithArrays))

  context

class Collection
  constructor: (makeItem, lookup) ->
    constructCollection(@, makeItem, lookup)

  set: (args...) =>
    @_cache[@lookup(args...)] = @make(args...)

  update: (args...) =>
    merge(@_cache[@lookup(args...)], args...)

  load: (items) =>
    forEach items, @set

  get: (args...) =>
    cloneDeep(@_cache[@lookup(args...)])

  delete: (args...) =>
    delete @_cache[@lookup(args...)]
    true


class CollectionCached
  constructor: (makeItem, lookup) ->
    constructCollection(@, makeItem, lookup)

  update: (args...) =>
    @_cache[@lookup(args...)] ?= []
    @_cache[@lookup(args...)].push(@make(args...))

  get: (args...) =>
    flow(last, cloneDeep)(@_cache[@lookup(args...)])

  getAll: (args...) =>
    cloneDeep(@_cache[@lookup(args...)])

  getSize: (args...) =>
    size(@_cache[@lookup(args...)]) or 0

  reset: (args...) =>
    delete @_cache[@lookup(args...)]
    true


# the combination of these should be unique
ROUTE_UNIQUES = ['subject', 'action']

# options will be stored by hash of ROUTE_UNIQUES
#
# routesSchema = [{
#   subject: 'exercises'
#   topic: '*' // optional, default
#   pattern: ''
#   method: 'GET'
#   action: 'fetch' // optional, defaults to method
#   baseUrl: // optional, will override API class default
#   onSuccess: -> // optional
#   onFail: -> // optional
#   headers: // optional
#   withCredentials: // option
# }]
METHODS_TO_ACTIONS =
  POST: 'create'
  GET: 'read'
  PATCH: 'update'
  DELETE: 'delete'
  PUT: 'modify'

makeRoute = (options = {}) ->
  # TODO throw errors
  # TODO look for validator lib, maybe even use React.PropTypes base/would be nice to
  #   validate that method is valid for example and not just exists.
  return options unless validateOptions('subject', 'pattern', 'method')(options)

  DEFAULT_ROUTE_OPTIONS =
    topic: '*'

  route = merge({}, DEFAULT_ROUTE_OPTIONS, options)
  route.action ?= METHODS_TO_ACTIONS[route.method]
  route.handledErrors ?= keys(route.errorHandlers) if route.errorHandlers

  route

class Routes extends Collection
  constructor: (routes = [], uniqueProperties = ROUTE_UNIQUES) ->
    hashRoute = makeHashWith(uniqueProperties...)
    lookup = flow(makeRoute, hashRoute)

    super(makeRoute, lookup)
    @load(routes)
    @

simplifyRequestConfig = (requestConfig) ->
  simpleRequest = pick(requestConfig, 'method', 'data', 'url', 'params')
  simpleRequest.url = simpleRequest.url.replace(requestConfig.baseURL, '') if requestConfig.baseURL
  simpleRequest.url = trim(simpleRequest.url, '/')

  if isEmpty(simpleRequest.data)
    simpleRequest = omit(simpleRequest, 'data')
  else if isString(simpleRequest.data)
    try
      simpleRequest.data = JSON.parse(simpleRequest.data)
    catch e

  simpleRequest.data = omitBy(simpleRequest.data, isUndefined) if simpleRequest.data

  simpleRequest

class XHRRecords
  constructor: ->
    hashRequestConfig = flow(simplifyRequestConfig, hashWithArrays)
    makeTime = ->
      moment()

    @_requests = new CollectionCached(makeTime, hashRequestConfig)
    @_responses = new CollectionCached(makeTime, hashRequestConfig)
    @

  queRequest: (requestConfig) =>
    @_requests.update(requestConfig)

  recordResponse: ({config}) =>
    @_responses.update(config)

  isPending: (requestConfig) =>
    if requestConfig
      @_requests.getSize(requestConfig) > @_responses.getSize(requestConfig)
    else
      some @_requests._cache, (cachedRequests, requestKey) =>
        size(cachedRequests) > size(@_responses._cache[requestKey])

  getResponseTime: (requestConfig) =>
    @_requests.get(requestConfig).diff(@_responses.get(requestConfig))


utils = {validateOptions, hashWithArrays, makeHashWith, constructCollection, makeRoute, simplifyRequestConfig}

module.exports = {Collection, CollectionCached, Routes, XHRRecords, utils, METHODS_TO_ACTIONS}
