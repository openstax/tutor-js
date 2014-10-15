$ = require 'jquery'

module.exports = new class ObjectCache
  _cache: {}

  _addTypePromise: (type, id, promise) ->
    @_cache[type] ?= {}
    @_cache[type][id] = promise
    # promise.then (obj) =>
    #   @_addType(type, obj)
    promise

  _fetchType: (type, id, url) ->
    cached = @_cache[type]?[id]
    if cached
      cached
    else
      @_addTypePromise(type, id, $.ajax(url, {dataType:'json'}))

  addTask: (obj) -> @_addType('task', obj) # TODO: Wrap in a promise
  fetchTask: (id) -> @_fetchType('task', id, "/api/tasks/#{id}")

  fetchUserTasks: -> 
    @_fetchType('tasks', 'user', '/api/user/tasks')
    .then (results) =>
      for task in results.items
        promise = $.Deferred()
        promise.resolve(task)
        @_addTypePromise('task', task.id, promise)
      results
