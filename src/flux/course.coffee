_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CourseConfig =

  createPractice: (courseId) ->
    @_local[courseId] ?= {}

  createdPractice: (obj, courseId) ->
    @emit('practice.created', obj.id)
    @loadedPractice(obj, courseId)

  loadPractice: (courseId) ->
    @_local[courseId] ?= {}

  loadedPractice: (obj, courseId) ->
    @_local[courseId].practice = obj
    obj.type = 'practice'

    TaskActions.loaded(obj, obj.id)
    @emit('practice.loaded', obj.id)


  exports:
    getPracticeId: (courseId) ->
      @_local?[courseId]?.practice?.id

    hasPractice: (courseId) ->
      @_local?[courseId]?.practice?

    getPractice: (courseId) ->
      if @getPracticeId(courseId) then TaskStore.get(@getPracticeId(courseId)) else {}


extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
