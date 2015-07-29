_ = require 'underscore'
flux = require 'flux-react'
DestinationHelper = require '../helpers/routes-and-destinations'

TransitionActions = flux.createActions [
  'load'
  'reset'
  '_get'
]


# Transition Store only loads into memory paths that are 'pushed'
# onto the react-router history.
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

  load: ({path, type}) ->
    type ?= 'push'
    @_local.push(path) if type is 'push'

  reset: ->
    @_local = []

  _get: ->
    @_local

  exports:
    getPrevious: (matchRoutes) ->
      history = @_get()
      backPath = history[history.length - 2]
      matchedRoute = matchRoutes(backPath) if backPath?
      deepestRouteName = _.last(matchedRoute.routes).name if matchedRoute?.routes?.length

      # Both path and name will be undefined if history does not have a previous entry.
      path: backPath
      name: DestinationHelper.getDestination(deepestRouteName)

module.exports = {TransitionActions, TransitionStore}
