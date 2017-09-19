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
# TLDR: Use router.history.push or Router.Link for routes you want
# in History and back button.  Only use router.replaceWith when you
# want that route to be ignored in History and back.

TransitionStore = flux.createStore
  actions: _.values(TransitionActions)
  _local: []

  load: (path) ->
    history = @_get()
    last = history[history.length - 1] if history.length
    @_local.push(path) if path isnt last and DestinationHelper.shouldRememberRoute(path)

  reset: ->
    @_local = []

  _get: ->
    @_local

  exports:
    getPrevious: (current = window.location.pathname) ->
      for path in @_local by -1
        if path isnt current
          return {path, name: DestinationHelper.destinationFromPath(path)}

module.exports = {TransitionActions, TransitionStore}
