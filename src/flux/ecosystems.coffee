_ = require 'underscore'
flux = require 'flux-react'

LOADING = 'loading'
FAILED  = 'failed'

EcosystemsActions = flux.createActions [
  'load'
  'loaded'
  'FAILED'
]

EcosystemsStore = flux.createStore
  actions: _.values(EcosystemsActions)

  _asyncStatus: null

  load: -> # Used by API
    @_asyncStatus = LOADING
    @emit('load')

  loaded: (ecosystems) ->
    @_ecosystems = ecosystems
    @emit('loaded')

  FAILED: ->
    @_asyncStatus = FAILED
    @emit('failed')

  exports:
    isLoaded: -> not _.isEmpty(@_ecosystems)
    isLoading: -> @_asyncStatus is LOADING
    isFailed:  -> @_asyncStatus is FAILED

    all: ->
      @_ecosystems

    getBook: (attrs) ->
      _.findWhere(@_ecosystems, attrs)

module.exports = {EcosystemsActions, EcosystemsStore}
