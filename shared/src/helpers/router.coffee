qs = require 'qs'
forEach = require 'lodash/forEach'
map = require 'lodash/map'
last = require 'lodash/last'
cloneDeep = require 'lodash/cloneDeep'
omit = require 'lodash/omit'
compact = require 'lodash/compact'
remove = require 'lodash/remove'
isEmpty = require 'lodash/isEmpty'
merge = require 'lodash/merge'
memoize = require 'lodash/memoize'
pathToRegexp = require 'path-to-regexp'
matchPattern   = require('react-router/matchPattern').default

class OXRouter

  constructor: (routes) ->
    @getRoutes = -> routes
    @getRoutesMap = -> mapRoutes(routes)

  pathToEntry: (path = window.location.pathname) =>
    findRoutePatternMemoed(path, @getRoutesMap())

  getQuery: (options = {}) =>
    qs.parse((options.window or window).location.search.slice(1))

  currentParams: (options = {}) =>
    @pathToEntry( (options.window or window).location.pathname)?.match.params or {}

  makePathname: (name, params, options = {}) =>
    @getRoutesMap()[name]?.toPath(params)

  isActive: (name, params, options = {}) =>
    route = @getRoutesMap()[name]
    route and (options.window or window).location.pathname is @makePathname(name, params, options)

  getRenderableRoutes: (renderers) =>
    routes = @getRoutes()

    traverseRoutes(routes, (route) ->
      return null unless renderers[route.name]?
      route.render = renderers[route.name]
      route
    )

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
