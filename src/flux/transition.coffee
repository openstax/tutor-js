_ = require 'underscore'
flux = require 'flux-react'

TransitionActions = flux.createActions [
  'load'
  'reset'
  '_get'
  '_getPathName'
]

routesAndNames =
  calendar: 'Calendar'
  list: 'Dashboard'
  performance: 'Performance Report'
  guide: 'Learning Guide'

TransitionStore = flux.createStore
  actions: _.values(TransitionActions)
  _local: []

  load: (path) ->
    name = @_getPathName(path)

    pathData = {path, name}
    @_local.push(pathData)

  reset: ->
    @_local = []

  _get: ->
    @_local

  _getPathName: (path) ->
    segments = path.split('/')
    matchedSegment = _.intersection(segments, _.keys(routesAndNames))

    routesAndNames[matchedSegment[0]] if matchedSegment?

  exports:
    getPrevious: ->
      history = @_get()
      history[history.length - 2] if history.length > 1

module.exports = {TransitionActions, TransitionStore}
