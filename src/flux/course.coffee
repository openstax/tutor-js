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
    @loadedPractice(obj, courseId)

  loadPractice: (courseId) ->
    @load(courseId, {})

  loadedPractice: (obj, courseId) ->
    @loaded({practice: obj}, courseId)
    obj.type = 'practice'

    TaskActions.loaded(obj, obj.id)
    @emit('practice.loaded', obj.id)


  exports:
    getPracticeId: (courseId) ->
      @_get(courseId)?.practice?.id

    hasPractice: (courseId) ->
      @_get(courseId)?.practice?

    getPractice: (courseId) ->
      if @_get(courseId)?.practice?
        task = TaskStore.get(@_get(courseId)?.practice?.id)
        @emit('practice.loaded', task.id)
      else
        task = {}

      task

extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
