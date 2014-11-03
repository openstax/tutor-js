flux = require 'flux-react'

CurrentUserActions = flux.createActions [
  'setToken'  # (token) ->
  'logout'    # () ->    # API Hooks onto this action and transitions
]

CurrentUserStore = flux.createStore
  actions: [
    CurrentUserActions.setToken
  ]

  state:
    token: null

  setToken: (token) ->
    @state.token = token

  exports:
    getToken: -> @token

module.exports = {CurrentUserActions, CurrentUserStore}
