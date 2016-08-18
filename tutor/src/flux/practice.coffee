_ = require 'underscore'
hash = require 'object-hash'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig, STATES} = require './helpers'

getTopicHash = _.partial(hash, _, {unorderedArrays: true})
makePractice = (result, courseId, topicParams) ->
  id: result.id
  created_for: topicParams
  exists: true

CoursePractice =

  _topics: {}
  _cache: {}

  _reset: ->
    @_topics = {}
    @_cache = {}

  _recordTopics: (taskId, courseId, topicParams) ->
    @_topics[courseId] ?= {}
    @_topics[courseId][taskId] = topicParams

  _addToCache: (thingToCache, courseId, topicParams) ->
    topicHash = getTopicHash(topicParams)
    return if _.isEmpty(topicHash)

    @_cache[courseId] ?= {}
    @_cache[courseId][topicHash] ?= []
    @_cache[courseId][topicHash].push(thingToCache)

  _cacheError: (result, courseId, topicParams) ->
    @_addToCache({exists: false}, courseId, topicParams)

  _cacheSuccess: (result, courseId, topicParams) ->
    practice = makePractice(result, courseId, topicParams)
    @_addToCache(practice, courseId, topicParams)
    practice

  _failed: (result, courseId, topicParams) ->
    @_cacheError(result, courseId, topicParams)

  create: (courseId, topicParams) ->
    @_local[courseId] = {} unless @dontReload(courseId)
    @_asyncStatus[courseId] = STATES.LOADED

  created: (result, courseId, topicParams) ->
    # this will use the base config's loaded, which will
    # run _loaded within.
    @loaded(result, courseId, topicParams)

  _loaded: (result, courseId, topicParams = {}) ->
    @emit("#{STATES.LOADED}.#{courseId}", courseId)
    TaskActions.loaded(result, result.id)

    @_recordTopics(result.id, courseId, topicParams)
    # cache and return practice for loading onto _local
    @_cacheSuccess(result, courseId, topicParams)

  _getFromCache: (courseId, topicParams) ->
    topicHash = getTopicHash(topicParams)
    return if _.isEmpty(topicHash)

    _.last(@_cache[courseId]?[topicHash])

  _get: (courseId, topicParams) ->
    if _.isEmpty(topicParams)
      @_local[courseId]
    else
      @_getFromCache(courseId, topicParams)

  exports:

    getTaskId: (courseId, topicParams) ->
      @_get(courseId, topicParams)?.id

    getPageIds: (courseId, topicParams) ->
      @_get(courseId, topicParams)?.created_for?.page_ids

    has: (courseId, topicParams) ->
      @_get(courseId, topicParams)?.exists

    get: (courseId, topicParams) ->
      return {} unless @exports.has.call(@, courseId, topicParams)

      taskId = @exports.getTaskId.call(@, courseId, topicParams)
      TaskStore.get(taskId)

    isDisabled: (courseId, topicParams) ->
      @_get(courseId, topicParams)? and @_get(courseId, topicParams).exists is false

    getCurrentTopics: (courseId, taskId) ->
      @_topics[courseId]?[taskId] or {}

extendConfig(CoursePractice, new CrudConfig())
{actions, store} = makeSimpleStore(CoursePractice)
module.exports = {CoursePracticeActions:actions, CoursePracticeStore:store}
