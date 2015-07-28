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

  load: (obj) ->
    obj.type ?= 'push'
    @_local.push(obj.path) if obj.type is 'push'

  reset: ->
    @_local = []

  _get: ->
    @_local

  exports:
    getPrevious: (matchRoutes) ->
      history = @_get()
      backPath = history[history.length - 2] if history.length > 1
      matchedRoute = matchRoutes(backPath)
      deepestRouteName = _.last(matchedRoute.routes).name if matchedRoute?.routes?.length

      path: backPath
      name: DestinationHelper.getDestination(deepestRouteName)

module.exports = {TransitionActions, TransitionStore}
