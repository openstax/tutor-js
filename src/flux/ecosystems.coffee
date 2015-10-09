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

    allBooks: ->
      _.map( _.pluck(@_ecosystems, 'books'), (book) -> _.first(book) )

    first: ->
      _first @_ecosystems

    getBook: (ecosystemId) ->
      _.findWhere(@_ecosystems, id: parseInt(ecosystemId, 10))

module.exports = {EcosystemsActions, EcosystemsStore}
