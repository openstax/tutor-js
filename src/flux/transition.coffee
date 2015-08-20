_ = require 'underscore'
flux = require 'flux-react'
DestinationHelper = require '../helpers/routes-and-destinations'

TransitionActions = flux.createActions [
  'load'
  'reset'
  '_get'
]


# Transition Store only loads into memory paths that are 'pushed'
# onto the react-router history and are reported as rememberable by
# DestinationHelper
#
# This means that the back button will only track the routes that are
# 'transitioned' to and not those that 'replace' location,
# as is the case with router.replaceWith
#
# TLDR: Use router.transitionTo or Router.Link for routes you want
# in History and back button.  Only use router.replaceWith when you
# want that route to be ignored in History and back.

TransitionStore = flux.createStore
  actions: _.values(TransitionActions)
  _local: []

  load: (change, router) ->
    {type, path} = change
    type ?= 'push'
    @_local.push(path) if type is 'push' and DestinationHelper.shouldRememberRoute(change, router)

  reset: ->
    @_local = []

  _get: ->
    @_local

  exports:
    getPrevious: (router) ->
      matchRoutes = router.match
      currentPath = DestinationHelper.destinationFromPath(router.getCurrentPath(), matchRoutes)
      history = @_get()
      pathIndex = _.findLastIndex(history, (path) ->
        currentPath isnt DestinationHelper.destinationFromPath(path, matchRoutes)
      )
      return {} if -1 is pathIndex

      # Both path and name will be undefined if history does not have a previous entry.
      {path: history[pathIndex], name: DestinationHelper.destinationFromPath(history[pathIndex], matchRoutes)}

module.exports = {TransitionActions, TransitionStore}
