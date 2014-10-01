_ = require 'underscore'
{Collection, Model} = require 'backbone'

LoadableMixin =
  _setPromiseState: (state) ->
    if @_promiseState isnt state
      @_promiseState = state
      @trigger('loading', state)

  promiseState: -> @_promiseState or 'UNLOADED'
  isLoaded: ->
    switch @_promiseState
      when 'RESOLVED' then true
      when 'REJECTED' then true
      else false

  load: ->
    # TODO: depending on the URL set an Accept header
    beforeSend = (xhr) ->
      xhr.setRequestHeader('Accept', 'application/vnd.exercises.openstax.v1')

    unless @_promiseState in ['LOADING', 'RESOLVED', 'REJECTED']
      @_promiseState = 'LOADING'
      @_promise = @fetch({beforeSend})
      @_promise.then (=> @_setPromiseState('RESOLVED')), (=> @_setPromiseState('REJECTED'))
      @trigger('loading', @_promiseState)
    @_promise

  reload: ->
    # Force a reload of data
    delete @_promiseState
    @load()


class LoadableModel extends Model
class LoadableCollection extends Collection
  parse: (json) ->
    # Collections are search results and as such have `total_count` and `items` fields
    throw new Error('Collections Should have a .items array') unless _.isArray(json.items)
    json.items

# Mixin the Loadable methods
_.extend(LoadableCollection::, LoadableMixin)
_.extend(LoadableModel::, LoadableMixin)


module.exports =
  Collection: LoadableCollection
  Model     : LoadableModel
