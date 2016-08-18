_ = require 'underscore'
{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig, STATES} = require './helpers'

CoursePractice =

  _topics: {}

  _reset: ->
    @_topics = {}

  recordTopics: (courseId, topicParams) ->
    @_topics[courseId] ?= []
    @_topics[courseId].push(topicParams)

  create: (courseId, topicParams) ->
    @_local[courseId] = {} unless @dontReload(courseId)
    @_asyncStatus[courseId] = STATES.LOADED
    @recordTopics(courseId, topicParams)

  created: (result, courseId, topicParams) ->
    # this will use the base config's loaded, which will
    # run _loaded within.
    @loaded(result, courseId)

  _loaded: (result, courseId) ->
    @emit("#{STATES.LOADED}.#{courseId}", courseId)
    TaskActions.loaded(result, result.id)

    result

  exports:

    getTaskId: (courseId) ->
      @_get(courseId)?.id

    getPageIds: (courseId) ->
      @_get(courseId)?.created_for?.page_ids

    has: (courseId) ->
      @_get(courseId)?

    get: (courseId) ->
      return {} unless @exports.has.call(@, courseId)

      taskId = @exports.getTaskId.call(@, courseId)
      TaskStore.get(taskId)

    getCurrentTopics: (courseId) ->
      _.last(@_topics[courseId]) or {}

extendConfig(CoursePractice, new CrudConfig())
{actions, store} = makeSimpleStore(CoursePractice)
module.exports = {CoursePracticeActions:actions, CoursePracticeStore:store}
