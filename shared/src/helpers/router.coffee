qs           = require 'qs'
map          = require 'lodash/map'
last         = require 'lodash/last'
omit         = require 'lodash/omit'
partial      = require 'lodash/partial'
merge        = require 'lodash/merge'
remove       = require 'lodash/remove'
memoize      = require 'lodash/memoize'
compact      = require 'lodash/compact'
isEmpty      = require 'lodash/isEmpty'
forEach      = require 'lodash/forEach'
cloneDeep    = require 'lodash/cloneDeep'
pathToRegexp = require 'path-to-regexp'
matchPattern = require('react-router/matchPattern').default

class OXRouter

  constructor: (routes) ->
    routes = cloneDeep(routes)
    mappedRoutes = cloneDeep(mapRoutes(routes))

    @getRoutes = -> routes
    @getRoutesMap = -> mappedRoutes

  pathToEntry: (path = window.location.pathname) =>
    cloneDeep(findRoutePatternMemoed(path, @getRoutesMap()))

  currentQuery: (options = {}) ->
    qs.parse((options.window or window).location.search.slice(1))

  currentParams: (options = {}) =>
    @pathToEntry( (options.window or window).location.pathname)?.match?.params or {}

  currentState: (options = {}) =>
    params: @currentParams(options)
    query:  @currentQuery(options)

  makePathname: (name, params, options = {}) =>
    route = @getRoutesMap()[name]?.toPath?(params)
    if options.query
      route + '?' + qs.stringify(options.query)
    else
      route

  isActive: (name, params, options = {}) =>
    route = @getRoutesMap()[name]
    route and (options.window or window).location.pathname is @makePathname(name, params, options)

  getRenderableRoutes: (renderers) =>
    routes = @getRoutes()
    routesMap = @getRoutesMap()

    traverseRoutes(routes, (route) ->
      return null unless renderers[route.name]?

      route.render = renderers[route.name]
      route.getParamsForPath = partial(getParamsByPattern, routesMap[route.name].pattern)
      route
    )

getParamsByPattern = (pattern, pathname = window.location.pathname) ->
  match = matchPattern(pattern, {pathname}, false)
  match?.params

traverseRoutes = (routes, transformRoute) ->
  modifiedRoutes = compact(map(routes, (route) ->
    if route.routes?
      route = transformRoute(route)
      return unless route

      nestedRoutes = traverseRoutes(route.routes, transformRoute)
      route.routes = nestedRoutes unless isEmpty nestedRoutes
      route
    else
      transformRoute(route)
  ))
  remove(modifiedRoutes, isEmpty)
  modifiedRoutes


mapRoutes = (routes, paths = {}, parentPath = {}) ->

  forEach(routes, (route) ->
    paths[route.name] = buildPathMemoed(route, parentPath)
    mapRoutes(route.routes, paths, paths[route.name]) if route.routes?
  )

  paths

buildPath = (route, parentPath) ->
  path = omit(cloneDeep(parentPath), 'toPath', 'name')
  path.name = route.name
  path.paths ?= []
  path.paths.push(route.name)
  path.patterns ?= []
  path.patterns.push(route.pattern)
  path.pattern = path.patterns.join('/')
  path.toPath = pathToRegexp.compile(path.pattern)

  path

buildPathMemoed = memoize(buildPath)

findRoutePattern = (pathname, mappedPaths) ->
  matchedEntrys = []

  matchedPaths = compact(map(mappedPaths, (path) ->
    match = matchPattern(path.pattern, {pathname}, false)
    matchedEntrys.push(path) if match
    match
  ))

  # return deepest match
  match = last(matchedPaths)
  entry = last(matchedEntrys)

  {match, entry}

findRoutePatternMemoed = memoize(findRoutePattern)

module.exports = OXRouter
