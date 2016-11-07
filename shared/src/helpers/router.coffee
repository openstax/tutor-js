qs           = require 'qs'
map          = require 'lodash/map'
last         = require 'lodash/last'
omit         = require 'lodash/omit'
pick         = require 'lodash/pick'
partial      = require 'lodash/partial'
merge        = require 'lodash/merge'
remove       = require 'lodash/remove'
extend       = require 'lodash/extend'
memoize      = require 'lodash/memoize'
compact      = require 'lodash/compact'
isEmpty      = require 'lodash/isEmpty'
forEach      = require 'lodash/forEach'
mapValues    = require 'lodash/mapValues'
cloneDeep    = require 'lodash/cloneDeep'
pathToRegexp = require 'path-to-regexp'
matchPattern = require('react-router/matchPattern').default

class OXRouter

  constructor: (routes) ->
    {routeSettings, renderers} = OXRouter.separateRendersFromRoutes(routes)
    mappedRoutes = mapRoutes(routeSettings)

    @getRenderers = -> renderers
    @getRoutes = -> routeSettings
    @getRoutesMap = -> mappedRoutes

  currentMatch: (path = window.location.pathname) =>
    cloneDeep(findRoutePatternMemoed(path, @getRoutesMap()))

  currentQuery: (options = {}) ->
    qs.parse((options.window or window).location.search.slice(1))

  currentParams: (options = {}) =>
    # needed until https://github.com/ReactTraining/react-router/pull/4064 is released
    params = @currentMatch( (options.window or window).location.pathname)?.params or {}
    mapValues(params, (value) -> if value is "undefined" then undefined else value )


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

  getRenderableRoutes: =>
    renderers = @getRenderers()
    routes = @getRoutes()
    routesMap = @getRoutesMap()

    traverseRoutes(routes, (route) ->
      return null unless renderers[route.name]?

      route.render = renderers[route.name]()
      route.getParamsForPath = partial(getParamsByPattern, routesMap[route.name].pattern)
      route
    )

OXRouter.separateRendersFromRoutes = (routes) ->
  renderers = {}

  routeSettings = traverseRoutes(routes, (route) ->
    renderers[route.name] = route.renderer if route.renderer?
    pick(route, 'pattern', 'name', 'routes')
  )

  {renderers, routeSettings}


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

  if matchedPaths.length
      # return deepest matches
    extend({}, last(matchedPaths), {
      entry: last(matchedEntrys)
    })
  else
    null


findRoutePatternMemoed = memoize(findRoutePattern)

module.exports = OXRouter
