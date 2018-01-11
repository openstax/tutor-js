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


{ matchPath } = require('react-router-dom')


class OXRouter

  constructor: (routes) ->
    {routeSettings, renderers} = OXRouter.separateRendersFromRoutes(routes)
    mappedRoutes = mapRoutes(routeSettings)

    @getRenderers = -> renderers
    @getRoutes = -> routeSettings
    @getRoutesMap = -> mappedRoutes

  currentMatch: (path = window.location.pathname) =>
    cloneDeep(findRoutePathMemoed(path, @getRoutesMap()))

  currentQuery: (options = {}) ->
    qs.parse((options.window or window).location.search.slice(1))

  currentParams: (options = {}) =>
    params = @currentMatch( (options.window or window).location.pathname)?.params or {}
    mapValues(params, (value) -> if value is "undefined" then undefined else value )


  currentState: (options = {}) =>
    params: @currentParams(options)
    query:  @currentQuery(options)

  makePathname: (name, params, options = {}) =>
    route = @getRoutesMap()[name]?.toPath?(params)

    unless isEmpty(options.query)
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
      route.getParamsForPath = partial(getParamsByPath, routesMap[route.name].path)
      route
    )

OXRouter.separateRendersFromRoutes = (routes) ->
  renderers = {}

  routeSettings = traverseRoutes(routes, (route) ->
    renderers[route.name] = route.renderer if route.renderer?
    pick(route, 'path', 'name', 'routes', 'settings')
  )

  {renderers, routeSettings}


getParamsByPath = (path, pathname = window.location.pathname) ->
  match = matchPath(pathname, { path: path })
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

buildPath = (route, parent) ->
  path = omit(cloneDeep(parent), 'toPath', 'name')
  extend(path, pick(route, 'settings', 'name'), {
    path: if parent.path then "#{parent.path}/#{route.path}" else route.path
  })
  path.toPath = pathToRegexp.compile(path.path)
  path

buildPathMemoed = memoize(buildPath)

findRoutePath = (pathname, mappedPaths) ->
  matchedEntrys = []

  matchedPaths = compact(map(mappedPaths, (path) ->
    match = matchPath(pathname, { path: path.path })
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


findRoutePathMemoed = memoize(findRoutePath)

module.exports = OXRouter
