_ = require 'underscore'
EventEmitter2 = require 'eventemitter2'

settings = require './settings'
{loader} = require './loader'

navigation = { views: {} }
channel = new EventEmitter2 wildcard: true

initialize = (options) ->
  _.extend(navigation, options)

  loader(navigation, settings.views)

getDataByView = (view) ->
  navigation.views[view] or {}

getViewByRoute = (route) ->
  navData = _.findWhere navigation.views, {route}
  view = navData?.state?.view or 'default'

  if view?
    view = 'task' if view is 'default'

  view

module.exports = {channel, initialize, getDataByView, getViewByRoute}
