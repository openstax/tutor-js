_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CourseConfig =

  createPractice: (courseId) ->
    # @create(@freshLocalId())
    # Contemplating how to use store with local id.
    @_local[courseId] ?= {}

  createdPractice: (obj, courseId) ->
    @emit('practice.created', obj.id)
    @loaded(obj, courseId)

  _loaded: (obj, courseId)->
    loadedObj = obj
    # also seems like a risky way to determine if a practice
    # is being loaded into the course store
    loadedObj = @loadPractice(obj, courseId) if obj.steps

    loadedObj

  loadPractice: (obj, courseId) ->
    loadedObj =
      practice: obj

    obj.type = 'practice'
    TaskActions.loaded(obj, obj.id)
    @emit('practice.loaded', obj.id)

    loadedObj

  exports:
    getPracticeId: (courseId) ->
      @_get(courseId)?.practice?.id

    hasPractice: (courseId) ->
      @_get(courseId)?.practice?

    getPractice: (courseId) ->
      if @_get(courseId)?.practice?
        task = TaskStore.get(@_get(courseId)?.practice?.id)
      else
        task = {}

      task

extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
