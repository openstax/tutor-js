$ = require 'jquery'

module.exports = new class ObjectCache
  _cache: {}

  _addTypePromise: (type, id, promise) ->
    @_cache[type] ?= {}
    @_cache[type][id] = promise
    # promise.then (obj) =>
    #   @_addType(type, obj)
    promise

  _fetchType: (type, id) ->
    cached = @_cache['task']?[id]
    if cached
      cached
    else
      @_addTypePromise(type, id, $.ajax("/api/tasks/#{id}", {dataType:'json'}))

  addTask: (obj) -> @_addType('task', obj) # TODO: Wrap in a promise
  fetchTask: (id) -> @_fetchType('task', id)
