flux = require 'flux-react'

CurrentUserActions = flux.createActions [
  'setToken'  # (token) ->
  'logout'    # () ->    # API Hooks onto this action and transitions
]

CurrentUserStore = flux.createStore
  actions: [
    CurrentUserActions.setToken
  ]

  _token: null

  setToken: (@_token) ->

  exports:
    getToken: -> @_token

module.exports = {CurrentUserActions, CurrentUserStore}
